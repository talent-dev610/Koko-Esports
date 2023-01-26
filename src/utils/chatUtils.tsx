export const calcUnreadMessagesThreads = (unreads: any[], threads: string[]) => {
  let result = 0;
  const threadIDs = Object.keys(unreads);
  threadIDs.forEach(threadID => {
    if (threads && threads.length > 0 && threads.includes(threadID)) {
      result += unreads[threadID];
    }
  });
  return result;
}
