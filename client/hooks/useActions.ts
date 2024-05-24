'use client'

import { useDispatch } from "react-redux"
import { ActionCreatorsMapObject, bindActionCreators } from "redux";
import { playerActions } from "@/store/reducers/playerReducer";
import { uploadPictureActions } from "@/store/reducers/uploadPictureSlice";
import { audioActions } from "@/store/reducers/audioSlice";
import { dropdownActions } from "@/store/reducers/dropdownSlice";
import { windowActions } from "@/store/reducers/windowSlice";
import { searchInputActions } from "@/store/reducers/searchInputSlice";
import { addTrackActions } from "@/store/reducers/addTrackSlice";
import { searchAlbumsActions } from "@/store/reducers/searchAlbumsSlice";
import { searchArtistsActions } from "@/store/reducers/searchArtistsSlice";

const AllActions = {
	...playerActions,
	...uploadPictureActions,
	...audioActions,
	...dropdownActions,
	...windowActions,
	...searchInputActions,
	...addTrackActions,
	...searchAlbumsActions,
	...searchArtistsActions
}

const useActions = () => {
	const dispatch = useDispatch()

	return bindActionCreators(AllActions, dispatch) 
}

export default useActions