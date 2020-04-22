import React, { useEffect } from "react";
import useAudio from "../util/useAudio";

function SongPlayer({ urls, songIndex }) {
  const [players, toggle] = useAudio(urls);

  useEffect(() => {
    if (!players[songIndex].playing) {
      toggle(songIndex)();
    }
  });

  return <div></div>;
}

export default SongPlayer;
