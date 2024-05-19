import { ITrack } from "@/types/track";
import { FC, memo } from "react";

interface MixPlaylistBtnProps {
    trackList: ITrack[]
}

const MixPlaylistBtn:FC<MixPlaylistBtnProps> = memo(({trackList})=> {

    return (
        <div>

        </div>
    )
})

export default MixPlaylistBtn