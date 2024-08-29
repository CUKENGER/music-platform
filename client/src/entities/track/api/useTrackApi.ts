import { useMutation } from "@tanstack/react-query";
import { create } from "./trackApi";
import { CreateTrackDto } from "../types/Track";

export const useCreateTrack = () => {

  return useMutation({
    mutationFn: (trackInfo: CreateTrackDto) => create(trackInfo),
  })
};
