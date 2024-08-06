import { AllActions } from "@/store/slices/rootReducer"
import { bindActionCreators } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"

const useActions = () => {
	const dispatch = useDispatch()

	return bindActionCreators(AllActions, dispatch) 
}

export default useActions