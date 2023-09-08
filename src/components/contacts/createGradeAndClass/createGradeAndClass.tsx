import {
  IonButton,
  IonCol,
  IonContent,
  IonIcon,
  IonModal,
  IonRow,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { v4 as uuid } from "uuid";

import { Storage } from "@ionic/storage";
import * as integration from "scholarpresent-integration";
import { close } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
//redux
import { connect, useDispatch } from "react-redux";
import { FlexboxGrid } from "rsuite";
import { contactsEditContact } from "../../../stores/contacts/actions";
import { fetchGrades, gradeSetData } from "../../../stores/grades/actions";
import { TENANT_ID } from "../../../utils/StorageUtil";
import CustomRadioGroup from "../customRadioGroup/CustomRadioGroup";
import "./createGradeAndClass.css";

const CreateGradeAndClass: React.FC<{
  open: boolean;
  closee: any;
  grades: any[];
  fetchGrades: Function;
  onSuccess: Function;
}> = ({ open, closee, grades, onSuccess, fetchGrades }) => {
  const store = new Storage();
  const [gradeOpen, setGradeOpen] = useState<boolean>(false);
  const [classOpen, setClassOpen] = useState<boolean>(false);
  const [state, setState] = useState<any>({
    grade: null,
    gradeLabel: "",
    class: null,
    classLabel: "",
  });
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [loadingClasses, setLoadingClasses] = useState<boolean>(false);
  const [btnGradeLoading, setBtnGradeLoading] = useState<boolean>(false);
  const [btnClassLoading, setBtnClassLoading] = useState<boolean>(false);
  const [allGrades, setAllGrades] = useState<any[]>([]);
  const [allClasses, setAllClasses] = useState<any[]>([]);
  const [allClassesDup, setAllClassesDup] = useState<any[]>([]);
  const [gradeSearchText, setGradeSearchText] = useState<string>("");
  const [classSearchText, setClassSearchText] = useState<string>("");
  const dispatch = useDispatch();

  const handleEditStuff = async (e: any) => {
    e.preventDefault();
    try {
      setBtnLoading(true);
      onSuccess({
        grade: state.grade,
        gradeLabel: state.gradeLabel,
        class: state.class,
        classLabel: state.classLabel,
      });
    } catch (err) {
      console.warn(err);
    } finally {
      setBtnLoading(false);
    }
  };
  const handleCreateGrade = async () => {
    if (!gradeSearchText) return;
    try {
      setBtnGradeLoading(true);
      // await integration.deleteGradeInfo(state.grade);
      let id = uuid();
      const gradeResp = await integration.createGradeInfo(id, gradeSearchText);
      console.log({ gradeResp });
      //if(gradeResp.id!==undefined || gradeResp?.gradeName){
      setState((s: any) => ({
        ...s,
        grade: gradeResp?.id,
        gradeLabel: gradeResp?.gradeName,
        class: null,
        classLabel: null,
      }));
      //}
      setGradeSearchText("");
      setBtnGradeLoading(false);
      const newGrades = [...grades];
      newGrades.unshift(gradeResp);
      dispatch(gradeSetData(newGrades));
    } catch (err) {
      console.error(err);
      setBtnGradeLoading(false);
    }
  };
  const handleCreateClass = async () => {
    if (!classSearchText) return;
    try {
      setBtnClassLoading(true);
      // await integration.deleteGradeInfo(state.grade);
      await store.create();
      let tenantId = await store.get(TENANT_ID);
      const classResp = await integration.createClassNameInfo(
        state.grade,
        classSearchText
      );
      console.log({ classResp });
      setBtnClassLoading(false);
      setClassSearchText("");
      setState((s: any) => ({
        ...s,
        class: classResp.id,
        classLabel: classResp.className,
      }));
      await handleFetchClasses(state.grade);
    } catch (err) {
      console.error(err);
      setBtnClassLoading(false);
    }
  };
  const handleFetchClasses = async (gradeId: string) => {
    let classesArr: any[] = [];
    let classes = await integration.listClassNamesByGradeIdInfo(gradeId, null);
    console.log("handleFetchClasses classes ", classes);
    if (classes?.items?.length > 0) {
      classesArr = [...classesArr, ...classes.items];
    }
    let nextToken = classes.nextToken;
    // while (nextToken != null) {
    //     let temp = await integration.listClassNamesByGradeIdInfo(gradeId, nextToken);
    //     nextToken = temp.nextToken;
    //     classesArr = [...classesArr, ...temp.items];
    // }
    setAllClasses([...classesArr]);
    setAllClassesDup([...classesArr]);
    setLoadingClasses(false);
  };
  useEffect(() => {
    console.log("first allGrades :", allGrades, " grades ", grades);
    if (open) {
      setAllGrades(grades);
    }
  }, []);
  // useEffect(() => {
  //     console.log("useEffect allGrades :", allGrades, " grades ", grades);
  // },[allGrades]);

  useEffect(() => {
    unstable_batchedUpdates(() => {
      setLoadingClasses(true);
      setAllClasses([]);
    });
    if (open) {
      if (state.grade?.length > 0) {
        handleFetchClasses(state.grade);
      }
    }
  }, [state.grade]);

  useEffect(() => {
    //console.log("useEffect Loading >>>>>>>>>>>> grades :", grades, " gradeSearchText ", gradeSearchText);
    if (open) {
      if (gradeSearchText && gradeSearchText.length > 0) {
        let filteredGrades = grades?.filter((grade: any) => {
          return grade?.gradeName
            ?.toLowerCase()
            ?.includes(gradeSearchText?.toLocaleLowerCase());
        });
        setAllGrades(filteredGrades);
      } else {
        setAllGrades(grades);
      }
    }
  }, [gradeSearchText, grades]);

  useEffect(() => {
    console.log("useEffect allClassesDup :", allClassesDup);
    if (open) {
      let filteredClasses = allClassesDup.filter((cls: any) =>
        cls.className
          .toLowerCase()
          .includes(classSearchText.toLocaleLowerCase())
      );
      setAllClasses(filteredClasses);
    }
  }, [classSearchText]);

  return (
    <IonModal
      isOpen={open}
      onDidDismiss={closee}
      cssClass="createGradeAndClassModal"
      showBackdrop={true}
    >
      <IonContent className="ion-padding createGradeAndClass">
        <form action="" onSubmit={handleEditStuff}>
          <IonRow>
            <IonCol>
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item>
                  <IonText className="PopupHeader">
                    Create new grade and class
                  </IonText>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <IonIcon
                    icon={close}
                    style={{
                      fontSize: 22,
                      verticalAlign: "top",
                      color: "#f00",
                    }}
                    onClick={closee}
                    className="drag-cancel"
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </IonCol>
          </IonRow>

          <IonRow className="ion-align-items-start ion-justify-content-around">
            <IonCol sizeLg="5">
              <CustomRadioGroup
                open={true}
                toggleOpen={() => setGradeOpen(!gradeOpen)}
                data={allGrades}
                //data={[{id:"1", gradeName:"Grade"}]}
                labelField="gradeName"
                defaultValue={{ value: state.grade, label: state.gradeLabel }}
                placeholder="Select Grade"
                onSelect={(value: any, label: string) => {
                  setState({
                    ...state,
                    grade: value,
                    gradeLabel: label,
                    class: null,
                    classLabel: null,
                  });
                }}
                loading={btnGradeLoading}
                btnText={gradeSearchText ? "Add this Grade" : ""}
                searchPlaceholder="Search or create new grade"
                btnAction={() => handleCreateGrade()}
                searchValue={gradeSearchText}
                searchOnChange={(value: string) => {
                  setGradeSearchText(value);
                  setState({ ...state, grade: null });
                }}
                alertTitle=""
                alertContent=""
                linkedValue={null}
              />
            </IonCol>
            <IonCol sizeLg="5">
              <CustomRadioGroup
                open={true}
                toggleOpen={() => setClassOpen(!classOpen)}
                data={allClasses}
                labelField="className"
                defaultValue={{ value: state.class, label: state.classLabel }}
                placeholder="Select Class"
                onSelect={(value: any, label: string) => {
                  setState({ ...state, class: value, classLabel: label });
                }}
                loading={btnClassLoading}
                btnText={classSearchText ? "Add this Class" : ""}
                searchPlaceholder="Search or create new class"
                btnAction={() => handleCreateClass()}
                searchValue={classSearchText}
                searchOnChange={(value: string) => {
                  setClassSearchText(value);
                }}
                alertTitle={
                  !state.grade
                    ? "Please select Grade first"
                    : classSearchText.length === 0
                    ? allClasses.length === 0
                      ? loadingClasses
                        ? "Loading..."
                        : "There is no class. Please create new one"
                      : "Please input keyword"
                    : ""
                }
                alertContent={classSearchText.length === 0 ? "" : ""}
                linkedValue={state.grade}
              />
            </IonCol>
          </IonRow>

          <IonRow className="ion-justify-content-center ion-align-items-center ion-margin-top">
            <IonButton
              fill="outline"
              className="outlineBtn drag-cancel"
              color="success"
              onClick={closee}
            >
              Cancel
            </IonButton>
            <IonButton
              className="outlineBtn drag-cancel"
              type="submit"
              disabled={btnLoading || !state.grade || !state.class}
            >
              {btnLoading ? <IonSpinner name="dots" /> : "Save"}
            </IonButton>
          </IonRow>
        </form>
      </IonContent>
    </IonModal>
  );
};
const mapStateToProps = (state: any) => ({
  grades: state.grades.grades,
  roles: state.roles.roles,
});
const mapDispatchToProps = {
  fetchGrades,
  contactsEditContact,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGradeAndClass);
