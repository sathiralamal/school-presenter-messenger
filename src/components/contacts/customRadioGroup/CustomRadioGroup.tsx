import React, { useEffect, useState } from "react";
import {
  IonText,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import { add, chevronDownOutline, searchOutline } from "ionicons/icons";
import { Input, FlexboxGrid, Radio, FormGroup, RadioGroup } from "rsuite";
import './customRadioGroup.css';

//redux
import { connect } from "react-redux";
const NewStaff: React.FC<{
  open: boolean;
  toggleOpen: Function;
  grades: any[];
  data: any[];
  defaultValue: any;
  placeholder: string;
  onSelect: Function;
  labelField: string;
  loading: boolean;
  btnText: string;
  btnAction: Function;
  searchOnChange: Function;
  searchValue: string;
  alertTitle: string;
  alertContent: string;
  linkedValue: any;
  searchPlaceholder?: string;
}> = ({
  open,
  toggleOpen,
  data,
  defaultValue,
  placeholder,
  onSelect,
  labelField,
  loading,
  btnText,
  btnAction,
  searchOnChange,
  searchValue,
  alertTitle,
  alertContent,
  linkedValue,
  searchPlaceholder,
}) => {
  return (
    <IonCol
      className="selectGroupWrapper StaffGradeWrapper"
      style={{ height: open ? "auto" : 35 }}
    >
      <IonRow
        onClick={() => {
          toggleOpen();
        }}
        style={{ cursor: "pointer" }}
        className="drag-cancel"
      >
        <FlexboxGrid className="selectGroup">
          <IonText
            style={{
              display: "flex",
              flex: 1,
              color:
                defaultValue.value?.length > 0
                  ? "#222 !important"
                  : "#fff !important",
            }}
            className="selectGroupText"
          >
            {defaultValue.value?.length > 0 ? defaultValue.label : placeholder}
          </IonText>
          <IonIcon
            icon={chevronDownOutline}
            style={{
              fontSize: 20,
              verticalAlign: "middle",
              color: "#fff",
            }}
          />
        </FlexboxGrid>
      </IonRow>
      {open === true && (
        <>
          <IonRow>
            <FlexboxGrid className="searchGroup">
              <Input
                className="searchGroupBorder drag-cancel"
                placeholder={searchPlaceholder || "Search"}
                value={searchValue}
                onChange={(value) => {
                  searchOnChange(value);
                }}
              />
              <IonIcon
                icon={searchOutline}
                style={{
                  fontSize: 22,
                  verticalAlign: "top",
                  color: "#222",
                }}
              />
            </FlexboxGrid>
          </IonRow>
          {data.length > 0 ? (
            <IonRow className="customRadioGroupWrapper ion-align-items-start">
              <IonCol>
                <FormGroup controlId={labelField}>
                    {data.map((item, i) => (
                      <FlexboxGrid
                        className={"Popcheckbox drag-cancel" + (item.id === defaultValue?.value ? ' customRadioGroup--selected' : '') }
                        key={`${labelField}_${i}`}
                        onClick={()=>{
                          toggleOpen();
                          onSelect(item.id, item[labelField]);
                        }}
                        style={{cursor: "pointer"}}
                      >
                        {item[labelField]}
                      </FlexboxGrid>
                    ))}
                </FormGroup>
              </IonCol>
            </IonRow>
          ) : (
            <>
              {linkedValue !== "" ? (
                <>
                  <FlexboxGrid
                    justify="center"
                    className="StaffSelectGradeText"
                  >
                    <IonText>{alertTitle}</IonText>
                    <IonText>{alertContent}</IonText>
                  </FlexboxGrid>
                  { btnText && (
                    <FlexboxGrid justify="space-around">
                      <IonButton
                        fill="outline"
                        className="outlineBtn btn-Grade drag-cancel"
                        onClick={() => btnAction()}
                        disabled={loading}
                      >
                        {loading ? (
                          <IonSpinner name="dots" />
                        ) : (
                          <>
                            <IonIcon
                              icon={add}
                              style={{
                                fontSize: 22,
                                verticalAlign: "middle",
                                color: "#219653",
                                marginRight: 7,
                              }}
                            />
                            {btnText}
                          </>
                        )}
                      </IonButton>
                    </FlexboxGrid>
                  )}
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </>
      )}
    </IonCol>
  );
};
const mapStateToProps = (state: any) => ({
  grades: state.grades.grades,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(NewStaff);
