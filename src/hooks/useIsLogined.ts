import { useEffect, useState } from "react";
import { CACHE_USER_LOGIN_ID } from "../utils/StorageUtil";
import { Storage } from "@ionic/storage";

import * as integration from "scholarpresent-integration";
import { isCatchClause } from "typescript";

export default function useIsLogined() {
    // null means is in loading state
    const [isLogined, setIsLogined] = useState<null | boolean>(null);

    useEffect(() => {
        (async function () {
            try{ 
                await integration.currentAuthenticatedUser();
                setIsLogined(true);
            }catch(error){
                setIsLogined(false);
            }
           
        })();
    }, []);

    return isLogined;
}
