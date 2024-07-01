import { bindActionCreators } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { counterActions } from "../store/slices/counterSlice"
import { dropdownActions } from "@/store/slices/dropdownSlice"
import { playerActions } from "@/store/slices/playerSlice"
import { trackTimeActions } from "@/store/slices/trackTimeSlice"
import { activeTrackListActions } from "@/store/slices/activeTrackListSlice"

const AllActions ={
  ...counterActions,
	...dropdownActions,
	...playerActions,
	...trackTimeActions,
	...activeTrackListActions,
}

const useActions = () => {
	const dispatch = useDispatch()

	return bindActionCreators(AllActions, dispatch) 
}

export default useActions