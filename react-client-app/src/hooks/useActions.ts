import { bindActionCreators } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { counterActions } from "../store/slices/counterSlice"
import { dropdownActions } from "@/store/slices/dropdownSlice"
import { playerActions } from "@/store/slices/playerSlice"

const AllActions ={
  ...counterActions,
	...dropdownActions,
	...playerActions,
}

const useActions = () => {
	const dispatch = useDispatch()

	return bindActionCreators(AllActions, dispatch) 
}

export default useActions