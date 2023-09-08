import React, { useEffect, useState, useRef } from "react";
import { v4 as uuid } from "uuid";

import {
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonSpinner,
  useIonAlert,
} from "@ionic/react";
import { add, close, chevronDownOutline, searchOutline } from "ionicons/icons";
import IntlTelInput from "react-intl-tel-input";

import "./editStaff.css";
import {
  Input,
  FlexboxGrid,
  InputPicker,
  Radio,
  FormGroup,
  RadioGroup,
} from "rsuite";
import CustomRadioGroup from "../customRadioGroup/CustomRadioGroup";
import { Storage } from "@ionic/storage";
import { TENANT_ID, TENANT_COUNTRY_CODE } from "../../../utils/StorageUtil";
import Draggable from "react-draggable";

//redux
import { connect } from "react-redux";
import { fetchGrades } from "../../../stores/grades/actions";
import { fetchRoles } from "../../../stores/roles/actions";

import { contactsEditContact } from "../../../stores/contacts/actions";

import * as integration from "scholarpresent-integration";
const EditStaff: React.FC<{
  open: boolean;
  closee: any;
  grades: any[];
  fetchGrades: Function;
  contactsEditContact: Function;
  staff: any;
  roles: any[];
  onSuccess: Function;
  fetchRoles: Function;
}> = ({
  open,
  closee,
  grades,
  fetchGrades,
  contactsEditContact,
  staff,
  roles,
  onSuccess,
  fetchRoles,
}) => {
  const [present] = useIonAlert();
  const store = new Storage();
  const [gradeOpen, setGradeOpen] = useState<boolean>(false);
  const [classOpen, setClassOpen] = useState<boolean>(false);
  const [state, setState] = useState<any>({
    firstName: "",
    lastName: "",
    role: "",
    phone: "",
    email: "",
    grade: null,
    gradeLabel: "",
    classLabel: "",
    class: null,
  });
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [btnGradeLoading, setBtnGradeLoading] = useState<boolean>(false);
  const [btnClassLoading, setBtnClassLoading] = useState<boolean>(false);
  const [rolesMod, setRolesMod] = useState<any[]>([]);
  const [allGrades, setAllGrades] = useState<any[]>([]);
  const [allClasses, setAllClasses] = useState<any[]>([]);
  const [allClassesDup, setAllClassesDup] = useState<any[]>([]);
  const [gradeSearchText, setGradeSearchText] = useState<string>("");
  const [classSearchText, setClassSearchText] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("za");

  const telInputRef = useRef<any>(null);

  const handleEditStuff = async (e: any) => {
    e.preventDefault();
    try {
      setBtnLoading(true);
      let updatedStaff = {
        id: staff.id,
        firstName: state.firstName,
        lastName: state.lastName,
        classNameId: state.class,
        contacts: [
          { contactType: "email", detail: state.email },
          { contactType: "sms", detail: state.phone },
        ],
        userRoleId: state.role,
      };
      console.log("state :", state);
      let staffInfo = await integration.updateUserInfo(updatedStaff);
      console.log(staffInfo);
      staffInfo.className = state.classLabel;
      staffInfo.gradeName = state.gradeLabel;
      // staffInfo.gradeId =
      console.log("grades :", grades);

      let selectedGrade = grades.find(function (object) {
        return object.gradeName === state.gradeLabel;
      });
      staffInfo.gradeId = selectedGrade?.id;
      console.log("selectedGrade :", selectedGrade);

      if (staffInfo?.id) {
        present({
          message: `User updated successfully!`,
          buttons: [
            {
              text: "Ok",
              handler: (d) => {
                contactsEditContact(staffInfo);
                onSuccess(staffInfo);
              },
            },
          ],
        });
      }
      closee();
    } catch (err) {
      console.warn(err);
    } finally {
      setBtnLoading(false);
    }
  };
  const handleCreateGrade = async () => {
    try {
      setBtnGradeLoading(true);
      let id = uuid();
      const gradeResp = await integration.createGradeInfo(id, gradeSearchText);
      console.log(gradeResp);
      await fetchGrades(undefined);
      setGradeSearchText("");
    } catch (err) {
    } finally {
      setBtnGradeLoading(false);
    }
  };
  const handleCreateClass = async () => {
    try {
      setBtnClassLoading(true);
      // await integration.deleteGradeInfo(state.grade);
      await store.create();
      let tenantId = await store.get(TENANT_ID);
      const classResp = await integration.createClassNameInfo(
        state.grade,
        classSearchText
      );
      console.log(classResp);
      await handleFetchClasses(state.grade);
      setClassSearchText("");
    } catch (err) {
      console.log(err);
    } finally {
      setBtnClassLoading(false);
    }
  };
  const handleFetchClasses = async (gradeId: string) => {
    let classesArr: any[] = [];
    let classes = await integration.listClassNamesByGradeIdInfo(gradeId, null);
    //classes = JSON.parse(classes);
    console.log(
      "[editStaff.tsx] handleFetchClasses classes.items ",
      classes.items
    );
    classesArr = [...classesArr, ...classes.items];
    let nextToken = classes.nextToken;
    while (nextToken != null) {
      let temp = await integration.listClassNamesByGradeIdInfo(
        gradeId,
        nextToken
      );
      nextToken = temp.nextToken;
      classesArr = [...classesArr, ...temp.items];
    }
    // let classesTemp: any[] = [];
    // classesArr.map((cls: any) => {
    //   classesTemp.push({
    //     label: cls.className,
    //     value: cls.id,
    //   })
    // })
    setAllClasses([...classesArr]);
    setAllClassesDup([...classesArr]);
  };

  useEffect(() => {
    store.create().then((value) => {
      store.get(TENANT_COUNTRY_CODE).then((retCountryCode) => {
        //console.log("retCountryCode ", retCountryCode);
        if (retCountryCode != null) {
          setCountryCode(retCountryCode);
          if (
            telInputRef != null &&
            telInputRef?.current?.updateFlagOnDefaultCountryChange
          ) {
            telInputRef.current.updateFlagOnDefaultCountryChange(
              retCountryCode
            );
          }
        }
      });
    });
  }, []);
  useEffect(() => {}, [countryCode]);

  useEffect(() => {
    let rolesTemp: any[] = [];
    roles
      .filter(
        (role: any) =>
          role?.roleName !== "Parent" && role?.roleName !== "Student"
      )
      .map((role: any) => {
        rolesTemp.push({
          label: role.roleName,
          value: role.id,
        });
      });
    setRolesMod(rolesTemp);
  }, [roles]);
  useEffect(() => {
    setAllGrades(grades);
  }, [grades]);
  useEffect(() => {
    if (state.grade?.length > 0) {
      handleFetchClasses(state.grade);
    } else {
      setAllClasses([]);
    }
  }, [state.grade]);
  useEffect(() => {
    if (gradeSearchText.length >= 3) {
      let filteredGrades = grades.filter((grade: any) =>
        grade.gradeName
          .toLowerCase()
          .includes(gradeSearchText.toLocaleLowerCase())
      );
      setAllGrades(filteredGrades);
    } else {
      setAllGrades(grades);
    }
  }, [gradeSearchText]);
  useEffect(() => {
    if (classSearchText.length >= 3) {
      let filteredClasses = allClassesDup.filter((cls: any) =>
        cls.className
          .toLowerCase()
          .includes(classSearchText.toLocaleLowerCase())
      );
      setAllClasses(filteredClasses);
    } else {
      setAllClasses(allClassesDup);
    }
  }, [classSearchText]);
  useEffect(() => {
    if (staff?.id) {
      console.log("[Edit Staff] grades ", grades, " staff ", staff);
      let filteredGrade = grades.filter(
        (grade: any) => grade.id === staff?.gradeId
      );
      let gradeLabel = "";
      if (filteredGrade.length) {
        gradeLabel = filteredGrade[0]?.gradeName;
      }
      setState({
        ...state,
        firstName: staff.firstName,
        lastName: staff.lastName,
        grade: staff?.gradeId,
        class: staff?.classNameId,
        classLabel: staff?.className,
        gradeLabel,
        phone: staff?.contactPhone,
        email: staff?.contactEmail,
        role: staff?.userRoleId,
      });
    }
  }, [staff]);
  return (
    // <Draggable defaultPosition={{ x: 0, y: 0 }} cancel=".drag-cancel">
    <IonItem
      lines="none"
      className="NewStaff"
      style={{ display: open ? "block" : "none" }}
    >
      <IonGrid>
        <form action="" onSubmit={handleEditStuff}>
          <IonRow>
            <IonCol>
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item>
                  <IonText className="PopupHeader">Edit Staff Member</IonText>
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
          <IonRow>
            <IonCol size="12" size-md="6">
              <Input
                placeholder="First Name"
                value={state.firstName}
                onChange={(value: string) =>
                  setState({ ...state, firstName: value })
                }
                required
                style={{ borderColor: "#f00" }}
                className="drag-cancel"
              />
              <IonText className="PopupLable"> First Name* </IonText>
            </IonCol>
            <IonCol size="12" size-md="6">
              <Input
                placeholder="Last Name"
                value={state.lastName}
                onChange={(value: string) =>
                  setState({ ...state, lastName: value })
                }
                required
                style={{ borderColor: "#f00" }}
                className="drag-cancel"
              />
              <IonText className="PopupLable"> Last Name* </IonText>
            </IonCol>
          </IonRow>
          <IonRow className="StaffRole">
            <IonCol size="12" size-md="6">
              <InputPicker
                className="PopupInputPicker drag-cancel"
                placeholder="Select Role"
                data={rolesMod}
                onSelect={(value, item) => {
                  setState({ ...state, role: value });
                }}
                defaultValue={state.role}
                key={state.role}
              />
            </IonCol>
          </IonRow>
          <IonRow className="StaffPhoneEmail">
            <IonCol size="12" size-md="6">
              {/* <Input placeholder="Phone" type='number' value={state.phone} onChange={(value: string) => setState({ ...state, phone: value })} required style={{ borderColor: "#f00" }} className="drag-cancel"/> */}

              <IntlTelInput
                fieldId="editStaffNumber"
                containerClassName="intl-tel-input"
                preferredCountries={[countryCode]}
                inputClassName="rs-input"
                placeholder="e.g. 073 123 4567"
                ref={telInputRef}
                value={
                  state.phone === null || state.phone === undefined
                    ? ""
                    : state.phone
                }
                telInputProps={{
                  onPaste: (e: any) => {
                    telInputRef.current.updateValFromNumber(
                      e.clipboardData.getData("text"),
                      false,
                      true
                    );
                    telInputRef.current.setNumber(
                      e.clipboardData.getData("text")
                    );
                    e.preventDefault();
                    e.stopPropagation();
                  },
                }}
                onPhoneNumberChange={(
                  status: any,
                  value: any,
                  countryData: any,
                  number: any,
                  id: any
                ) => {
                  number = number.replace(/ /g, "");
                  setCountryCode(countryData.iso2);
                  setState({ ...state, phone: number });
                  // setMobileNumber(number);
                  // if (number.length > 1 && value.match(/^[+]*[0-9 ]*$/)) {
                  //     setLoginButtonEnabler(true);
                  // } else {
                  //     setLoginButtonEnabler(false);
                  // }
                }}
              />
              <IonText className="PopupLable"> Phone* </IonText>
            </IonCol>
            <IonCol size="12" size-md="6">
              <Input
                placeholder="Email"
                value={state.email}
                onChange={(value: string) =>
                  setState({ ...state, email: value })
                }
                className="drag-cancel"
                type="email"
              />
              <IonText className="PopupLable"> Email </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            {/* <IonCol size="12" size-md="6">
            <InputPicker
              className="PopupInputPicker"
              placeholder="Select Grade"
              data={allGrades}
              onSelect={(value, item)=>{
                setState({...state, grade: value})
              }}
              defaultValue={state.grade}
            />
          </IonCol> */}
            <CustomRadioGroup
              open={gradeOpen}
              toggleOpen={() => setGradeOpen(!gradeOpen)}
              data={allGrades}
              labelField="gradeName"
              defaultValue={{ value: state.grade, label: state.gradeLabel }}
              placeholder="Select Grade"
              onSelect={(value: any, label: string) => {
                setState({ ...state, grade: value, gradeLabel: label });
              }}
              loading={btnGradeLoading}
              btnText="Add this Grade"
              btnAction={() => handleCreateGrade()}
              searchValue={gradeSearchText}
              searchOnChange={(value: string) => {
                setGradeSearchText(value);
              }}
              alertTitle="Not found in our records!"
              alertContent="Please confirm spelling before adding a new grade."
              linkedValue={null}
            />
            <CustomRadioGroup
              open={classOpen}
              toggleOpen={() => setClassOpen(!classOpen)}
              data={allClasses}
              labelField="className"
              defaultValue={{ value: state.class, label: state.classLabel }}
              placeholder="Select Class"
              onSelect={(value: any, label: string) => {
                setState({ ...state, class: value, classLabel: label });
              }}
              loading={btnClassLoading}
              btnText="Add this Class"
              btnAction={() => handleCreateClass()}
              searchValue={classSearchText}
              searchOnChange={(value: string) => {
                setClassSearchText(value);
              }}
              alertTitle="Not found in our records!"
              alertContent="Please confirm spelling before adding a new class."
              linkedValue={state.grade}
            />
            {/* <IonCol size="12" size-md="6">
              <InputPicker
                className="PopupInputPicker"
                placeholder="Select Class"
                data={allClasses}
                onSelect={(value, item) => {
                  setState({ ...state, class: value })
                }}
                defaultValue={state.class}
              />
            </IonCol> */}
          </IonRow>
          <IonRow>
            <IonCol>
              <FlexboxGrid justify="end">
                <FlexboxGrid.Item>
                  <IonButton
                    fill="outline"
                    className="outlineBtn drag-cancel"
                    color="success"
                    onClick={closee}
                  >
                    Cancel
                  </IonButton>
                  <IonButton
                    className="btn-green-popup drag-cancel"
                    type="submit"
                    disabled={btnLoading || state.role === ""}
                  >
                    {btnLoading ? <IonSpinner name="dots" /> : "Save"}
                  </IonButton>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </IonCol>
          </IonRow>
        </form>
      </IonGrid>
    </IonItem>
    // </Draggable>
  );
};
const mapStateToProps = (state: any) => ({
  grades: state.grades.grades,
  roles: state.roles.roles,
});
const mapDispatchToProps = {
  fetchGrades,
  fetchRoles,
  contactsEditContact,
};
export default connect(mapStateToProps, mapDispatchToProps)(EditStaff);
