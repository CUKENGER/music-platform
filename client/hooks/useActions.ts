'use client'


import { useDispatch } from "react-redux"
import { bindActionCreators } from "redux";
import { playerActions } from "@/store/reducers/playerReducer";
import { uploadPictureActions } from "@/store/reducers/uploadPictureSlice";
import { audioActions } from "@/store/reducers/audioSlice";
import { dropdownActions } from "@/store/reducers/dropdownSlice";
import { windowActions } from "@/store/reducers/windowSlice";
import { searchInputActions } from "@/store/reducers/searchInputSlice";

const AllActions = {
	...playerActions,
	...uploadPictureActions,
	...audioActions,
	...dropdownActions,
	...windowActions,
	...searchInputActions,
}

const useActions = () => {
	const dispatch = useDispatch()

	return bindActionCreators(AllActions, dispatch)
}

export default useActions