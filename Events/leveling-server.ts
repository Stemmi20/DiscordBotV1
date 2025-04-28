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

  if (levellingCD.get(msg.guildId)?.has(msg.author.id)) return;
  if (levellingCD.get(msg.channelId)?.has(msg.author.id)) return;

  const cooldown = 60;

  Jobs.scheduleJob(
    new Date(Date.now() + (cooldown < 1 ? 1000 : cooldown * 1000)),
    () => {
      levellingCD.get(msg.guildId)?.delete(msg.author.id);
      levellingCD.get(msg.channelId)?.delete(msg.author.id);
    }
  );

  const level = await DataBase.level.findUnique({
    where: { userid_guildid: { userid: msg.author.id, guildid: msg.guildId } },
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
        userid_guildid: { userid: msg.author.id, guildid: msg.guildId },
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
        guildid: msg.guildId,
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
  await doRoles(msg, levelData, member.user);
};

const doEmbed = async (
  msg: Discord.Message<true>,
  levelData: LevelData,
  user: Discord.User
) => {
  msg.reply({
    content: `You Leveled Up to Level: ${levelData.newLevel}!`,
  });
};

const roles:[number, string][] = [
  [5, "1366307209910292552"],
  [10, "1366307308581158964"],
  [15, "1366307351073783848"],
  [20, "1366310223517581313"],
  [30, "1366310260062556250"],
  [40, "1366310296129376316"],
  [50, "1366310326303461446"],
  [60, "1366310359727734815"],
  [70, "1366310416455827546"],
  [80, "1366310456515498014"],
  [90, "1366310495048568935"],
  [100, "1366310530687438908"],
];

const doRoles = async (
  msg: Discord.Message<true>,
  levelData: LevelData,
  user: Discord.User
) => {
  const role = roles.find((r) => r[0] === levelData.newLevel);
  if (!role) return;
  const guild = msg.guild;
  if (!guild) return;
  const member = guild.members.cache.get(user.id);
  if (!member) return;
  const roleId = role[1];
  const roleData = guild.roles.cache.get(roleId);
  if (!roleData) return;
  if (member.roles.cache.has(roleId)) return;
  await member.roles.add(roleId).catch((err) => {
    console.error("Error adding role:", err);
  });
  msg.reply({
    content: `You know own the Role: ${roleData.name}!`,
  });
};
