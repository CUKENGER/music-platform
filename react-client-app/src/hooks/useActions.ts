import { bindActionCreators } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { counterActions } from "../store/slices/counterSlice"


const AllActions ={
  ...counterActions
}

const useActions = () => {
	const dispatch = useDispatch()

	return bindActionCreators(AllActions, dispatch) 
}

export default useActions