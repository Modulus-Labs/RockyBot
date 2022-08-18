import { DonationToken } from "./interact";
import {
  MS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_MINUTE,
  MS_PER_WEEK,
  MS_PER_SECOND,
  MS_PER_MONTH,
  MS_PER_YEAR
} from '../constants';

export const roundNumber = (num: number, decimals: number = 2): number => {
  return Math.round(Math.pow(10, decimals) * num) / Math.pow(10, decimals);
}

export const truncateAddr = (addr: string, length: number = 10): string => {
  return addr.substring(0, length) + "..." + addr.substring(addr.length - 5);
}

export const convertToHumanUnits = (nativeAmount: number, tokenType: DonationToken): number => {
  return tokenType === "USDC" ? nativeAmount / 1e6 : nativeAmount / 1e18;
}

export function getShortDateRepr(date: Date): string {
  return `${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

export function getNumDaysSince(fromDate: Date, toDate: Date): number {
  let timeDiffMs: number = toDate.getTime() - fromDate.getTime();
  return Math.floor(timeDiffMs / MS_PER_DAY);
}

export function getShorthandTimeIntervalString(
  oldTime: Date,
  negate: boolean
): string {
  const now = new Date();
  let timeDiffMs: number = now.getTime() - oldTime.getTime();
  if (negate) {
    timeDiffMs *= -1;
  }
  // --- If negative, just display zero ---
  if (timeDiffMs <= 0) {
    return '0m';
  }
  // --- Within the last minute ---
  if (timeDiffMs < MS_PER_MINUTE) {
    return `${Math.floor(timeDiffMs / MS_PER_SECOND)}s`;
  }
  // --- See if the last message was sent within the last hour ---
  if (timeDiffMs < MS_PER_HOUR) {
    return `${Math.floor(timeDiffMs / MS_PER_MINUTE)}m`;
  }
  // --- Within the last day (display hours) ---
  if (timeDiffMs < MS_PER_DAY) {
    return `${Math.floor(timeDiffMs / MS_PER_HOUR)}h`;
  }

  // --- Within the last week (display days) ---
  if (timeDiffMs < MS_PER_WEEK) {
    return `${Math.floor(timeDiffMs / MS_PER_DAY)}d`;
  }

  // --- Default: Display weeks ---
  // return `${Math.floor(timeDiffMs / MS_PER_WEEK)}w`;

  // --- Within the last month (display weeks) ---
  if (timeDiffMs < MS_PER_MONTH) {
    return `${Math.floor(timeDiffMs / MS_PER_WEEK)}w`;
  }

  // --- Within the last year (display months) ---
  if (timeDiffMs < MS_PER_YEAR) {
    return `${Math.floor(timeDiffMs / MS_PER_MONTH)}m`;
  }

  // --- More than a year (display number of years) ---
  return `${Math.floor(timeDiffMs / MS_PER_YEAR)}y`;
}