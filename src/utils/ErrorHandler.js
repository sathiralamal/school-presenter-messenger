import { withRouter , useHistory} from "react-router-dom";
import React, { useState, useEffect } from "react";
export const ErrorHandler = (props) => {
    let error = props.error;
    let history = useHistory();
    useEffect(() => {
        console.log('[ErrorHandler.js] errorHandler ',error);

        if(error==="No current user"){
            console.log('[ErrorHandler.js] forwaring to login');
            history.push("/login");
        }
    });

    return "";
}

export default withRouter(ErrorHandler);
