import { GRADES_LOADING, GRADES_SET_DATA } from "./constants";
import * as integration from "scholarpresent-integration";

export function gradeSetLoading(loading) {
	return {
		type: GRADES_LOADING,
		payload: loading
	};
}
export function gradeSetData(params) {
	return {
		type: GRADES_SET_DATA,
		payload: params
	};
}
export const fetchGrades = (nextToken) => (dispatch) => {
	console.log("fetchGrades  nextToken ", nextToken)
	return new Promise((resolve, reject) => {
		dispatch(gradeSetLoading(true));
		// let gradesArray = []
		// if(nextToken === undefined){
		// 	let innerNextToken = "";
			
		// 	let results = await integration.getGrades(null);
		// 	gradesArray.push(...results.items)

		// 	while(results.nextToken!=null){
		// 		let resultsNext = await integration.getGrades(results.nextToken);
		// 		gradesArray.push(...resultsNext.items)
		// 	}
			
		// }
		// console.log("fetchGrades gradesArray ", gradesArray);

		integration.getGrades(nextToken).then(async (res) => {

			console.log("fetchGrades res ",res, " nextToken ", nextToken);
			if(res?.nextToken!=null){
				console.log("fetchGrades fetch more ", nextToken);

				if(Array.isArray(res.items)){
					dispatch(gradeSetData(res.items));
					//fetchGrades(res.nextToken);
				}else{
					resolve([])
				}
			}else{
				if(Array.isArray(res.items)){
					dispatch(gradeSetData(res.items));
					resolve(res.items);
				}else{
					resolve([])
				}
			}
			

		
		}).catch((err) => {
			console.log(err, "fetchGrades --->>>");

			reject(err);
		}).finally(() => {
			dispatch(gradeSetLoading(false));
		})

		// if(Array.isArray(res.items)){
		// 	dispatch(gradeSetData(res.items));
		// 	resolve(res.items);
		// }else{
		// 	resolve([])
		// }

	})
};