import React from "react";
import { useSearchParams } from "expo-router";
import "querystring";
import ThreadView from "../../../src/components/note/letterDetail/ThreadView";

const ThreadScreen = () => {
  const { userId, id } = useSearchParams();

  return <ThreadView userId={userId} id={id} />;
};

export default ThreadScreen;
