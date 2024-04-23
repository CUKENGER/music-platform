'use client'


import { useDispatch } from "react-redux"
import { bindActionCreators } from "redux";
import { playerActions } from "@/store/reducers/playerReducer";
import { uploadPictureActions } from "@/store/reducers/uploadPictureSlice";
import { audioActions } from "@/store/reducers/audioSlice";

const AllActions = {
	...playerActions,
	...uploadPictureActions,
	...audioActions,
}

const useActions = () => {
	const dispatch = useDispatch()

	return bindActionCreators(AllActions, dispatch)
}

export default useActions