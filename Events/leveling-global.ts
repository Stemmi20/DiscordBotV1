import Prisma from "@prisma/client";
import * as Discord from "discord.js";
import * as Jobs from "node-schedule";
import * as StringSimilarity from "string-similarity";
import DataBase from "../database";
import getRandom from "../UtileModules/GetRandom";

type LevelData = {
  oldXP: number;
  newXP: number;
  newLevel: number;
  oldLevel: number;
};
const guildLevellingCD = new Set<string>();
const lastMessageGuild = new Map<string, string>();
const levellingCD = new Map<string, Set<string>>();

export default async (msg: Discord.Message<true>) => {
  if (msg.author.bot) return;

  levelling(msg);
};

const levelling = async (msg: Discord.Message<true>) => {
  if (guildLevellingCD.has(msg.author.id)) return;

  const lastMessage = lastMessageGuild.get(msg.author.id);
  if (
    lastMessage &&
    StringSimilarity.compareTwoStrings(msg.content, lastMessage) > 0.9
  )
    return;
  lastMessageGuild.set(msg.author.id, msg.content);
  guildLevellingCD.add(msg.author.id);

  Jobs.scheduleJob(new Date(Date.now() + 5000), () => {
    guildLevellingCD.delete(msg.author.id);
  });

  if (levellingCD.get("1")?.has(msg.author.id)) return;
  if (levellingCD.get(msg.channelId)?.has(msg.author.id)) return;

  const cooldown = 60;

  Jobs.scheduleJob(
    new Date(Date.now() + (cooldown < 1 ? 1000 : cooldown * 1000)),
    () => {
      levellingCD.get("1")?.delete(msg.author.id);
      levellingCD.get(msg.channelId)?.delete(msg.author.id);
    }
  );

  const level = await DataBase.level.findUnique({
    where: { userid_guildid: { userid: msg.author.id, guildid: "1" } },
  });

  const baseXP = 15;

  if (level) {
    updateLevels(msg, level, baseXP < 0 ? 1 : baseXP);

    return;
  }

  insertLevels(msg, baseXP < 0 ? 1 : baseXP);
};

const updateLevels = async (
  msg: Discord.Message<true>,
  level: Prisma.level,
  baseXP: number
) => {
  const newXP = Math.floor(getRandom(baseXP, baseXP + 10));

  const oldLevel = Number(level.level);
  const xp = newXP + Number(level.xp) < 1 ? 1 : newXP + Number(level.xp);
  const neededXP =
    (5 / 6) *
    (oldLevel + 1) *
    (2 * (oldLevel + 1) * (oldLevel + 1) + 27 * (oldLevel + 1) + 91);
  let newLevel = oldLevel;

  if (xp >= neededXP) {
    newLevel += 1;

    if (level) {
      levelUp(
        {
          oldXP: Number(level.xp),
          newXP: xp,
          newLevel: oldLevel + 1,
          oldLevel,
        },
        msg.member!,
        msg
      );
    }
  }

  DataBase.level
    .update({
      where: {
        userid_guildid: { userid: msg.author.id, guildid: "1" },
      },
      data: {
        level: newLevel,
        xp,
        userid: msg.author.id,
      },
    })
    .then();
};

const insertLevels = (msg: Discord.Message<true>, baseXP: number) => {
  const xp = Math.floor(getRandom(baseXP, baseXP + 10));

  DataBase.level
    .create({
      data: {
        userid: msg.author.id,
        xp,
        level: 0,
        guildid: "1",
      },
    })
    .then();
};

export const levelUp = async (
  levelData: LevelData,
  member: Discord.GuildMember | Discord.DiscordAPIError | Error,
  msg: Discord.Message<true>
) => {
  if ("message" in member) return;

  await doEmbed(msg, levelData, member.user);
};

const doEmbed = async (
  msg: Discord.Message<true>,
  levelData: LevelData,
  user: Discord.User
) => {
  msg.reply({
    content: `You Leveled Up Global to Level: ${levelData.newLevel}!`,
  });
};