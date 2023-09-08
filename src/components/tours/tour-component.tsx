import React, {useEffect, useState, useRef } from "react";
import { Button, InputGroup,Uploader, Icon, Input, Grid, Row, Col, Message, Modal, Slider } from "rsuite";

import {
  IonSlides,
  IonSlide,
  IonContent,
  IonButton,
  useIonAlert,
  IonImg,
  IonRow,
  IonGrid,
  IonCol,      
  IonModal,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon
} from "@ionic/react";
import { Storage } from "@ionic/storage";

import { TOUR_ACTIVE } from "../../utils/StorageUtil";
import "./tour-component.css";
// @ts-ignore
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import { useHistory, useParams } from "react-router-dom";


const TourComponent = (props:any)=> {
  const [present] = useIonAlert();
  let history = useHistory();

  const mySlides = useRef(null);
  const [show, setShow] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < 992)
  const [role, setRole] = useState<string>('')
  const [isEnded, setIsEnded] = useState<boolean>(false)


  const params:any = useParams();
  const store = new Storage();



  const slideOpts = {
    initialSlide: 0,
  };

  useEffect(() => {
    console.log("[showModal] ", showModal, " [role] ", role, " [mobile] ", mobile)

    store.create().then((value: any) => {
      store.get(TOUR_ACTIVE).then(value=>{
        console.log("TOUR_ACTIVE ", value);

        if(value !==null){
          setShowModal(value);
        }else{
          setShowModal(params.showtour);
        }

      }).catch((error:any)=>console.log("TOUR_ACTIVE error ", error))
    });
    setRole(params.tourrole);

    
  },[params]);
  useEffect(() => {
    console.log("props--->", props)
    setShowModal(props?.showtour);
    setRole(props?.tourrole);
  },[props?.showtour, props?.tourrole]); 

  useEffect(() => {

    if(props.location?.search){
      console.log("props.location?.search ===> ", props.location?.search);

      setRole(props.location?.search.indexOf("school") >0?"school":"learner" );
    }
    console.log("props ===> ", props)
  }, [props?.location]);
  useEffect(() => {
    console.log("showModal ===> ", showModal , " isEnded ", isEnded)
  }, );

  const [swiper, setSwiper] = useState<any>({});

    const init = async function(this: any) {
     setSwiper(await this.getSwiper());
    };

  const onBtnClicked = async (direction: string) => {
    
    if (direction === "next") {
      swiper?.slideNext();
    } else if (direction === "prev") {
      setIsEnded(false);
      swiper?.slidePrev();
    } else if (direction === "ended"){
      handleCacheTourStatus(false);
      setShowModal(false);
    }
  };
  const handleSlidesLoad = (e: any) => {
    console.log(" handleSlidesLoad ", e);

    swiper.lockSwipes(true);
  };

  const handleCacheTourStatus=(tourStatus:boolean)=>{
      console.log("handleCacheTourStatus tourStatus ", tourStatus);
      store.create().then((value: any) => {
      store.set(TOUR_ACTIVE, tourStatus);
    });
  }

  const schoolSliderComponent =()=>{
    return <IonContent>
    <IonSlides onIonSlidesDidLoad={init}
      options={slideOpts}
      pager={true}
      onIonSlideNextEnd={async(e:any) => {
        console.log("next", e);
        console.log("isEnd :", await e?.target?.isEnd())
        
        setIsEnded( await e?.target?.isEnd());

      }}

    >
      <IonSlide>
        <IonGrid>
          <IonRow>
            <p><b>Congradulations</b>, you have successfully sign up your school.  </p>
            <IonCol size="12" size-md="6">
              <img
                
                src="/assets/slider/school-0.png"
              />
            </IonCol>
            
            <IonCol size="12" size-md="6">
              <p>
                Now we will take you through the features of Scholar Present
                <br/>
                <br/>
               Connect, communicate and 
               <br/>
                collaborate on Scholar Present. 
               </p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonSlide>
      <IonSlide>
      <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6">
              <img
                src="/assets/slider/school-2.png"
                />
            </IonCol>
            <IonCol size="12" size-md="6">
              Stay connected on email, sms or app messaging with Scholar Present. 
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonSlide>
      <IonSlide>
      <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6">
              <img
                src="/assets/slider/school-3.png"
              />
            </IonCol>
            <IonCol size="12" size-md="6">
              Create groups for classess, grades and other extra mural activities.
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonSlide>
      <IonSlide>
      <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6">
              <img
                src="/assets/slider/school-4.png"
              />
            </IonCol>
            <IonCol size="12" size-md="6">
              Assign multiple administrators on Scholar Present to collect and update information.
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonSlide>
    </IonSlides>
    <IonFooter className={!mobile?"ion-footer":"ion-footer-center"}>
    {!mobile?<>
      <IonButton
        type="submit"
        disabled={swiper.current?.isBeginning}
        onClick={() => onBtnClicked("prev")}

      >
        PREV
      </IonButton>
      <IonButton
        type="submit"
        disabled={swiper.current?.isEnd}
        onClick={() => onBtnClicked(!isEnded?"next":"ended")}
      >
        {!isEnded? "NEXT":"FINISH"}
      </IonButton></>:<IonButton
        type="submit"
        disabled={swiper.current?.isBeginning}
        onClick={() => {handleCacheTourStatus(false); history.push("/contacts")}}
        className="btn-green-popup drag-cancel"

      >Got it</IonButton>
        
      }
      
    </IonFooter>

  </IonContent>
  }

  const parentOrLearnerSliderComponent =()=>{
    return <IonContent>
    <IonSlides onIonSlidesDidLoad={init}
      options={slideOpts}
      pager={true}
      onIonSlideNextEnd={async(e:any) => {
        console.log("next", e);
        setIsEnded( await e?.target?.isEnd());

      }}

    >
      <IonSlide>
        <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6">
              <img
                
                src="/assets/slider/parent-1.png"
              />
            </IonCol>
            <IonCol size="12" size-md="6">
              Scholar Present allows you to send messages in text, audio and multimedia.
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonSlide>
      <IonSlide>
      <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6">
              <img
                src="/assets/slider/parent-2.png"
              />
            </IonCol>
            <IonCol size="12" size-md="6">
              Connect directly to your children's class teachers
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonSlide>
      <IonSlide>
      <IonGrid>
          <IonRow>
            <IonCol size="12" size-md="6">
              <img
                
                src="/assets/slider/parent-3.png"
              />
            </IonCol>
            <IonCol size="12" size-md="6">
              Stay up to date with the all school activities. 
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonSlide>
    </IonSlides>
    <IonFooter className={!mobile?"ion-footer":"ion-footer-center"}>
      {!mobile?<>
      <IonButton
        type="submit"
        //disabled={mySlides.current?.isBeginning}
        onClick={() => onBtnClicked("prev")}
        className="disabled-button-solid"

      >
        PREV
      </IonButton>
      <IonButton
        type="submit"
        //   disabled={mySlides.current?.isEnd}
        onClick={() => onBtnClicked(!isEnded?"next":"ended")}
      >
        {!isEnded? "NEXT":"FINISH"}

      </IonButton></>:<IonButton
        type="submit"
        //disabled={mySlides.current?.isBeginning}
        onClick={() => history.push("/contacts")}
        className="btn-green-popup drag-cancel"

      >Got it</IonButton>
        
      }
      
    </IonFooter>

  </IonContent>
  }

  
  return (
    <>
    {console.log("[[[[[[[[ Loading Tutorial ]]]]]]]] showModal ", showModal, " mobile ", mobile )} 
    {!mobile?<>
      <IonModal isOpen={showModal?true:false}> 
      {role ==="school"? schoolSliderComponent(): parentOrLearnerSliderComponent()}      
      </IonModal> 
      </>:<>{role ==="school"? schoolSliderComponent(): parentOrLearnerSliderComponent()}</>
    }
    </>
  );
};
export default TourComponent;
