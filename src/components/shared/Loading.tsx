import React from "react";
import { IonSpinner, IonContent } from "@ionic/react";

export default function Loading() {
    return (
        <>
            <IonContent className="ion-text-center">
            ScholarPresent Page Loading ...
            <IonSpinner className="ion-margin-top" />
        </IonContent>
        </>
        
    );
}
