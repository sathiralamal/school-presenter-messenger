import React, { useEffect, useState } from "react";
import {
  IonItem,
  IonText,
  IonButton,
  IonIcon,
  useIonAlert,
  IonSpinner,
  IonSelect,
} from "@ionic/react";
import {
  FlexboxGrid,
  Input,
  InputPicker,
  Popover,
  Whisper,
  Progress,
  Icon,
  Panel,
  Table,
} from "rsuite";
import { close } from "ionicons/icons";
import useGetCacheTenantId from "../../../hooks/useGetCacheTenantId";

import { TENANT_ID, CACHE_USER_LOGIN_ID } from "../../../utils/StorageUtil";
import { Storage } from "@ionic/storage";
import { v4 as uuid } from "uuid";
import Draggable from "react-draggable";
import "./columnMapping.css";

//redux
import { connect } from "react-redux";
import {
  fetchContacts,
  contactsResetContacts,
} from "../../../stores/contacts/actions";
import { fetchGrades } from "../../../stores/grades/actions";
import { fetchClasses } from "../../../stores/classes/actions";
import * as integration from "scholarpresent-integration";

const ColumnMapping: React.FC<{
  open: boolean;
  closee: any;
  done: any;
  headers: any[];
  csvData: any[];
  type: string;
  roles: any[];
  classes: any[];
  fetchContacts: Function;
  contactsResetContacts: Function;
  filter: string;
  fetchGrades: Function;
  fetchClasses: Function;
}> = ({
  open,
  closee,
  done,
  headers,
  csvData,
  type,
  roles,
  classes,
  fetchContacts,
  contactsResetContacts,
  filter,
  fetchGrades,
  fetchClasses,
}) => {
  const { Line } = Progress;
  const { HeaderCell, Cell, Column } = Table;

  const store = new Storage();
  const [present] = useIonAlert();
  const [headersMod, setHeadersMod] = useState<any[]>([]);
  const [headersSelected, setHeadersSelected] = useState<any>({});
  const VALIDATE_LEARNER_DATA = 4,
    VALIDATE_PARENT_1_DATA = 5,
    VALIDATE_PARENT_2_DATA = 6;
  const [step, setStep] = useState<number>(1);
  const [list, setList] = useState<any[]>([]);
  const [newGroupPrepared, setNewGroupPrepared] = useState<any[]>([]);
  let tempNewGroupPrepared: any = [];

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  let rowsWithError = [];

  let tenantId: string = useGetCacheTenantId();

  let newBulkClasses: any = [];
  let newBulkGrades: any = [];
  const [mapDataLearner, setMapDataLearner] = useState<any[]>([
    {
      input: "Learner's First Name*",
      select: "Match Heading",
    },
    {
      input: "Learner's Last Name*",
      select: "Match Heading",
    },
    {
      input: "Learner's Grade*",
      select: "Match Heading",
    },
    {
      input: "Learner's Class*",
      select: "Match Heading",
    },
    {
      input: "Learner's Mobile",
      select: "Match Heading",
    },
    {
      input: "Learner's Email",
      select: "Match Heading",
    },
    {
      input: "Parent 1 First Name*",
      select: "Match Heading",
    },
    {
      input: "Parent 1 Last Name*",
      select: "Match Heading",
    },
    {
      input: "Parent 1 Mobile",
      select: "Match Heading",
    },
    {
      input: "Parent 1 Email",
      select: "Match Heading",
    },
    {
      input: "Parent 2 First Name*",
      select: "Match Heading",
    },
    {
      input: "Parent 2 Last Name*",
      select: "Match Heading",
    },
    {
      input: "Parent 2 Mobile",
      select: "Match Heading",
    },
    {
      input: "Parent 2 Email",
      select: "Match Heading",
    },
  ]);

  const mapDataStaff = [
    {
      input: "Staff's First Name*",
      select: "Match Heading",
    },
    {
      input: "Staff's Last Name*",
      select: "Match Heading",
    },
    {
      input: "Role*",
      select: "Match Heading",
    },
    {
      input: "Staff's Mobile Number*",
      select: "Match Heading",
    },
    {
      input: "Staff's Email",
      select: "Match Heading",
    },
    {
      input: "Staff's Grade",
      select: "Match Heading",
    },
    {
      input: "Staff's Class*",
      select: "Match Heading",
    },
  ];

  useEffect(() => {
    if (open) {
      let headersTemp: any[] = [];
      headers.map((header: any, i: number) => {
        headersTemp.push({
          label: header,
          value: { header, i },
        });
      });
      setHeadersMod([...headersTemp]);
    }
  }, [headers, open]);
  useEffect(() => {
    if (open) {
      if (type === "learner") {
        if (step === 1) {
          let selectedHeaderList = mapDataLearner;
          console.log("useEffect selectedHeaderList ", selectedHeaderList);
          let newArray = {
            ...headersSelected,
          };
          for (let index = 0; index < selectedHeaderList.length; index++) {
            console.log(
              "findHeaderIndex ",
              findHeaderIndex(selectedHeaderList[index].input)
            );
            let headerIndex = findHeaderIndex(selectedHeaderList[index].input);
            if (headerIndex > -1) {
              mapDataLearner[index] = {
                input: mapDataLearner[index].input,
                select: headers[headerIndex],
              };

              newArray[index] = headerIndex;

              setHeadersSelected(newArray);
            }
          }
          console.log("useEffect mapDataLearner ", mapDataLearner);
          console.log(
            "useEffect mapDataLearner headersSelected ",
            headersSelected
          );

          setList([...mapDataLearner.slice(0, 6)]);
        } else if (step === 2) {
          setProgressPercent(0);

          setHeadersSelected(headersSelected);

          setList([...mapDataLearner.slice(6, 10)]);
        } else if (step === 3) {
          setHeadersSelected(headersSelected);

          setList([...mapDataLearner.slice(10, 14)]);
        }
      } else {
        let selectedHeaderList = mapDataStaff;
        console.log("useEffect selectedHeaderList ", selectedHeaderList);
        let newArray = {
          ...headersSelected,
        };
        for (let index = 0; index < selectedHeaderList.length; index++) {
          console.log(
            "findStaffHeaderIndex ",
            findStaffHeaderIndex(selectedHeaderList[index].input)
          );
          let headerIndex = findStaffHeaderIndex(
            selectedHeaderList[index].input
          );
          if (headerIndex > -1) {
            mapDataStaff[index] = {
              input: mapDataStaff[index].input,
              select: headers[headerIndex],
            };

            newArray[index] = headerIndex;

            setHeadersSelected(newArray);
          }
        }
        console.log("useEffect mapDataLearner ", mapDataStaff);
        console.log(
          "useEffect mapDataLearner headersSelected ",
          headersSelected
        );

        setList([...mapDataStaff]);
      }
    }
  }, [step, open, type]);
  useEffect(() => {
    //console.log("useEffect newGroupPrepared ", newGroupPrepared)
    //console.log("useEffect newGroupPrepared" )
  });

  useEffect(() => {}, [mapDataLearner]);

  const createRowData = (rowIndex: any) => {
    const randomKey = Math.floor(Math.random() * 9);
    const names = [
      "Hal",
      "Bryan",
      "Linda",
      "Nancy",
      "Lloyd",
      "Alice",
      "Julia",
      "Albert",
      "Hazel",
    ];
    const citys = [
      "Beijing",
      "Shanghai",
      "New Amieshire",
      "New Gust",
      "Lefflerstad",
      "East Catalina",
      "Ritchieborough",
      "Gilberthaven",
      "Eulaliabury",
    ];
    const emails = [
      "yahoo.com",
      "gmail.com",
      "hotmail.com",
      "outlook.com",
      "aol.com",
      "live.com",
      "msn.com",
      "yandex.com",
      "mail.ru",
    ];

    return {
      id: rowIndex + 1,
      name: names[randomKey],
      city: citys[randomKey],
      email: names[randomKey].toLocaleLowerCase() + "@" + emails[randomKey],
    };
  };

  const data = Array.from({ length: 20 }).map((_, index) =>
    createRowData(index)
  );
  const findHeaderIndex = (headerName: string) => {
    console.log("findHeaderIndex headerName ", headerName);
    if (headerName === undefined) {
      return -1;
    }
    headerName = headerName.replace("'s", "");

    console.log("Split ", headerName.split(" "));
    let headerNameArray = headerName.split(" ");
    let tab =
      headerNameArray[0].toLowerCase() === "learner" ? "learner" : "parent";

    let searchKey =
      headerNameArray[
        tab === "learner" ? 1 : headerNameArray.length > 2 ? 2 : 1
      ];
    let secondSearchKey =
      headerNameArray[
        tab === "learner" ? 1 : headerNameArray.length > 2 ? 1 : 1
      ];

    console.log("***searchKey ", searchKey, " tab ", tab);

    searchKey = searchKey.replace("*", "");
    searchKey = searchKey.toLowerCase();
    for (
      let indexExcelHeader = 0;
      indexExcelHeader < headers.length;
      indexExcelHeader++
    ) {
      console.log("headers[indexExcelHeader] ", headers[indexExcelHeader]);
      if (
        tab === "learner" &&
        headers[indexExcelHeader].toLowerCase().includes(tab.toLowerCase()) &&
        headers[indexExcelHeader].toLowerCase().includes(searchKey)
      ) {
        console.log(
          "Match ? ",
          headers[indexExcelHeader].toLowerCase().includes(tab.toLowerCase()) &&
            headers[indexExcelHeader].toLowerCase().includes(searchKey)
        );
        console.log("indexExcelHeader  ", indexExcelHeader);

        return indexExcelHeader;
      } else if (
        tab !== "learner" &&
        headers[indexExcelHeader].toLowerCase().includes(tab.toLowerCase()) &&
        headers[indexExcelHeader].toLowerCase().includes(searchKey) &&
        headers[indexExcelHeader].toLowerCase().includes(secondSearchKey)
      ) {
        console.log(
          "Match ? ",
          headers[indexExcelHeader].toLowerCase().includes(tab.toLowerCase()) &&
            headers[indexExcelHeader].toLowerCase().includes(searchKey)
        );
        console.log("indexExcelHeader  ", indexExcelHeader);

        return indexExcelHeader;
      }
    }

    return -1;
  };

  const findStaffHeaderIndex = (headerName: string) => {
    console.log("findHeaderIndex headerName ", headerName);
    if (headerName === undefined) {
      return -1;
    }
    headerName = headerName.replace("'s", "");
    headerName = headerName.replace("*", "");

    console.log("Split ", headerName.split(" "));
    let headerNameArray = headerName.split(" ");

    let tab = headerNameArray[0].toLowerCase() === "staff" ? "staff" : "staff";

    let searchKey = null;
    if (headerNameArray.length === 1) {
      searchKey = headerNameArray[0];
    } else if (tab === "staff") {
      searchKey = headerNameArray[1];
    } else {
      searchKey = headerNameArray[1];
    }

    console.log("***searchKey ", searchKey, " tab ", tab);

    searchKey = searchKey.toLowerCase();

    for (
      let indexExcelHeader = 0;
      indexExcelHeader < headers.length;
      indexExcelHeader++
    ) {
      console.log("headers[indexExcelHeader] ", headers[indexExcelHeader]);
      if (
        tab === "staff" &&
        headers[indexExcelHeader].toLowerCase().includes(tab.toLowerCase()) &&
        headers[indexExcelHeader].toLowerCase().includes(searchKey)
      ) {
        console.log(
          "Match ? ",
          headers[indexExcelHeader].toLowerCase().includes(tab.toLowerCase()) &&
            headers[indexExcelHeader].toLowerCase().includes(searchKey)
        );
        console.log("indexExcelHeader  ", indexExcelHeader);

        return indexExcelHeader;
      } else if (
        tab !== "staff" &&
        headers[indexExcelHeader].toLowerCase().includes(tab.toLowerCase()) &&
        headers[indexExcelHeader].toLowerCase().includes(searchKey)
      ) {
        console.log(
          "Match ? ",
          headers[indexExcelHeader].toLowerCase().includes(tab.toLowerCase()) &&
            headers[indexExcelHeader].toLowerCase().includes(searchKey)
        );
        console.log("indexExcelHeader  ", indexExcelHeader);

        return indexExcelHeader;
      }
    }

    return -1;
  };
  const handleImportStaff = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        setBtnLoading(true);
        let staffArr: any[] = [];
        console.log("handleImportStaff csvData ", csvData);
        let _roles = await integration.getUserRoles();
        let roles = JSON.parse(_roles);

        console.log("***** roles:", roles);
        let studentRole = roles?.items.find(
          (role: any) => role.roleName === "Student"
        );
        let parentRole = roles?.items.find(
          (role: any) => role.roleName === "Parent"
        );
        let studentRoleName = studentRole.roleName;
        let parentRoleName = parentRole.roleName;
        await store.create();
        let userId = await store.get(CACHE_USER_LOGIN_ID);

        console.log("handleImportStaff roles ", roles);

        await prepareStaffImportGradeAndClass(csvData);

        for (let i = 1; i < csvData.length; i++) {
          let staffId = uuid();
          console.log("processing csvData[i]  ", csvData[i]);
          console.log("processing headersSelected[0] ", headersSelected[0]);
          console.log("processing headersSelected[1] ", headersSelected[1]);
          console.log("processing headersSelected[3] ", headersSelected[3]);

          if (
            csvData[i]?.[headersSelected[0]] &&
            csvData[i]?.[headersSelected[1]] &&
            csvData[i]?.[headersSelected[3]]
          ) {
            let roleId = roles.items.find(
              (role: any) =>
                role.roleName?.toLowerCase() ===
                csvData[i]?.[headersSelected[2]]?.toLowerCase()
            );
            console.log("roleId ", roleId);
            console.log(
              "headersSelected ",
              headersSelected,
              " headersSelected[6] ",
              headersSelected[6]
            );

            console.log("csvData[i] ", csvData[i]);
            console.log(
              "csvData[i]?.[headersSelected[6]]?.toLowerCase() ",
              csvData[i]?.[headersSelected[6]]?.toLowerCase()
            );

            let filteredClass: any = classes.find(
              (className: any) =>
                className.className?.toLowerCase() ===
                csvData[i]?.[headersSelected[6]]?.toLowerCase()
            );
            console.log("filteredClass ", filteredClass, " classes ", classes);
            if (filteredClass && filteredClass.className) {
              //Prep Learners Group
              let prepGroupNameParent =
                filteredClass.className + " " + studentRoleName;
              amendPreGroupCreation(
                prepGroupNameParent,
                [staffId],
                [staffId, userId]
              );

              let prepGroupLearnerAndParents =
                filteredClass.className +
                " " +
                studentRoleName +
                " & " +
                parentRoleName;
              amendPreGroupCreation(
                prepGroupLearnerAndParents,
                [staffId],
                [staffId, userId]
              );

              //Prep Parent & Student Grade Group
              let prepGroupLearnerAndParentsGrade =
                filteredClass?.grade?.gradeName +
                " " +
                studentRoleName +
                " & " +
                parentRoleName;
              amendPreGroupCreation(
                prepGroupLearnerAndParentsGrade,
                [staffId],
                [userId]
              );
            }
            amendPreGroupCreation("BROADCAST", [staffId], [userId]);

            // Prep ALL PARENTS
            amendPreGroupCreation("ALL PARENTS", [staffId], [userId]);
            // Prep Parents of Grade Group
            amendPreGroupCreation(
              filteredClass?.grade?.gradeName + " " + parentRoleName,
              [staffId],
              [userId]
            );

            amendPreGroupCreation("ALL STAFF", [staffId], [userId]);

            if (roleId && roleId.id) {
              console.log("filteredClass ", filteredClass);
              staffArr.push({
                id: staffId,
                firstName: csvData[i]?.[headersSelected[0]],
                lastName: csvData[i]?.[headersSelected[1]],
                email: csvData[i]?.[headersSelected[4]],
                phoneNumber: csvData[i]?.[headersSelected[3]],
                contactable: "everyone",
                classId: filteredClass?.id,
                userRoleId: roleId.id,
              });
            }
          }
        }
        console.log("handleImportStaff staffArr ", staffArr);

        if (staffArr?.length) {
          setShowProgress(true);
          let i,
            j,
            chunks,
            chunkSize = 50;
          let percent = 0;
          let staffResp: any[] = [];
          await store.create();
          let tenantId = await store.get(TENANT_ID);

          for (i = 0, j = staffArr.length; i < j; i += chunkSize) {
            chunks = staffArr.slice(i, i + chunkSize);
            let respUploads = await integration.bulkUserUpload(
              tenantId,
              chunks
            );
            staffResp.push(respUploads);
            percent = (i / staffArr.length) * 100;
            setProgressPercent(parseInt(percent.toString()));
          }

          resolve(staffResp);
        } else {
          resolve(null);
        }
      } catch (err) {
        reject(err);
      } finally {
        setBtnLoading(false);
      }
    });
  };

  const handleCreateGrade = async (gradeName: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        let id = uuid();

        const gradeResp = await integration.createGradeInfo(id, gradeName);
        //console.log(gradeResp);
        await fetchGrades(undefined);
        resolve(gradeResp);
      } catch (err) {
        reject(null);
      }
    });
  };
  const handleCreateClass = async (gradeId: string, className: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        // await integration.deleteGradeInfo(state.grade);
        await store.create();
        let tenantId = await store.get(TENANT_ID);
        const classResp = await integration.createClassNameInfo(
          gradeId,
          className
        );
        console.log(classResp);
        resolve(classResp);
      } catch (err) {
        reject(null);
      }
    });
  };
  const handleImportLearner = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        setBtnLoading(true);
        let learnerArr: any[] = [];
        let parentArr: any[] = [];
        let classesTemp: any[] = [];
        setShowProgress(true);
        let percent = 0;

        // Create Grades and Classes
        let cleanCsvData = [];
        for (let i = 1; i < csvData.length; i++) {
          let tempArray = csvData[i];
          console.log("tempArray ", tempArray);
          if (tempArray.length > 1 && tempArray[1].length > 0) {
            cleanCsvData.push(csvData[i]);
          }
        }
        console.log("***** cleanCsvData:", cleanCsvData, " csvData ", csvData);
        csvData = cleanCsvData;
        console.log("***** Classes:", classes);

        await prepareGradeAndClass(csvData);

        let _roles = await integration.getUserRoles();
        let roles = JSON.parse(_roles);
        console.log("***** userRoles:", roles);
        let studentRole = roles.items.find(
          (role: any) => role.roleName === "Student"
        );
        let parentRole = roles.items.find(
          (role: any) => role.roleName === "Parent"
        );
        let studentRoleName = studentRole.roleName;
        let parentRoleName = parentRole.roleName;
        let studentRoleId = studentRole.id;
        let parentRoleId = parentRole.id;
        await store.create();
        let userId = await store.get(CACHE_USER_LOGIN_ID);

        let prepGroups = [];
        // groupName
        // groupMembers
        // groupAdminUsers
        console.log("***** Classes:", classes);

        for (let i = 1; i < csvData.length; i++) {
          if (
            csvData[i]?.[headersSelected[0]] &&
            csvData[i]?.[headersSelected[1]] &&
            csvData[i]?.[headersSelected[2]] &&
            csvData[i]?.[headersSelected[3]]
          ) {
            // if (studentRoleId.length) {
            //   studentRoleId = studentRoleId[0]?.id
            // }
            // if (parentRoleId.length) {
            //   parentRoleId = parentRoleId[0]?.id
            // }
            let learnerId = uuid();

            let filteredClass: any = classes.find(
              (className: any) =>
                className.className?.toLowerCase() ===
                csvData[i]?.[headersSelected[3]]?.toLowerCase()
            );
            console.log(
              "csvData[i]?.[headersSelected[3]]?.toLowerCase() ",
              csvData[i]?.[headersSelected[3]]?.toLowerCase()
            );
            let parentId1 = uuid();

            console.log("---- filteredClass ", filteredClass);

            //Prep Learners Group
            let prepGroupName = filteredClass.className + " " + studentRoleName;
            amendPreGroupCreation(prepGroupName, [learnerId], [userId]);
            //Prep Parent & Student Class Group
            let prepGroupLearnerAndParents =
              filteredClass.className +
              " " +
              studentRoleName +
              " & " +
              parentRoleName;
            amendPreGroupCreation(
              prepGroupLearnerAndParents,
              [learnerId],
              [userId]
            );
            //Prep Parent & Student Grade Group
            console.log("<<<<<< filteredClass:", filteredClass);
            let prepGroupLearnerAndParentsGrade =
              filteredClass?.grade?.gradeName +
              " " +
              studentRoleName +
              " & " +
              parentRoleName;
            amendPreGroupCreation(
              prepGroupLearnerAndParentsGrade,
              [learnerId],
              [userId]
            );
            // Prep BroadCast Group
            amendPreGroupCreation("BROADCAST", [learnerId], [userId]);
            amendPreGroupCreation("ALL STUDENT", [learnerId], [userId]);
            // Prep Grade Group
            amendPreGroupCreation(
              filteredClass?.grade?.gradeName + " " + studentRoleName,
              [learnerId],
              [userId]
            );

            learnerArr.push({
              id: learnerId,
              firstName: csvData[i]?.[headersSelected[0]],
              lastName: csvData[i]?.[headersSelected[1]],
              email: csvData[i]?.[headersSelected[5]] || "",
              phoneNumber: csvData[i]?.[headersSelected[4]] || "",
              contactable: "private",
              classId: filteredClass ? filteredClass.id : null,
              userRoleId: studentRoleId,
              userModelLinkedUserId: parentId1,
            });
            if (
              csvData[i]?.[headersSelected[6]] &&
              csvData[i]?.[headersSelected[7]]
            ) {
              //Prep Parent Class Group
              let prepGroupNameParent =
                filteredClass.className + " " + parentRoleName;
              amendPreGroupCreation(prepGroupNameParent, [parentId1], [userId]);
              //Prep Parent & Student Class Group
              let prepGroupLearnerAndParents =
                filteredClass.className +
                " " +
                studentRoleName +
                " & " +
                parentRoleName;
              amendPreGroupCreation(
                prepGroupLearnerAndParents,
                [parentId1],
                [userId]
              );

              //Prep Parent & Student Grade Group
              let prepGroupLearnerAndParentsGrade =
                filteredClass?.grade?.gradeName +
                " " +
                studentRoleName +
                " & " +
                parentRoleName;
              amendPreGroupCreation(
                prepGroupLearnerAndParentsGrade,
                [parentId1],
                [userId]
              );

              amendPreGroupCreation("BROADCAST", [parentId1], [userId]);

              // Prep ALL PARENTS
              amendPreGroupCreation("ALL PARENTS", [parentId1], [userId]);
              // Prep Parents of Grade Group
              amendPreGroupCreation(
                filteredClass?.grade?.gradeName + " " + parentRoleName,
                [parentId1],
                [userId]
              );

              parentArr.push({
                id: parentId1,
                firstName: csvData[i]?.[headersSelected[6]],
                lastName: csvData[i]?.[headersSelected[7]],
                email: csvData[i]?.[headersSelected[9]] || "",
                phoneNumber: csvData[i]?.[headersSelected[8]] || "",
                contactable: "private",
                classId: filteredClass ? filteredClass.id : null,
                userRoleId: parentRoleId,
                userModelLinkedUserId: learnerId,
              });
            }
            if (
              csvData[i]?.[headersSelected[10]] &&
              csvData[i]?.[headersSelected[11]]
            ) {
              let parentId2 = uuid();
              //Prep Learners Group
              let prepGroupNameParent =
                filteredClass.className + " " + parentRoleName;
              amendPreGroupCreation(prepGroupNameParent, [parentId2], [userId]);

              let prepGroupLearnerAndParents =
                filteredClass.className +
                " " +
                studentRoleName +
                " & " +
                parentRoleName;
              amendPreGroupCreation(
                prepGroupLearnerAndParents,
                [parentId2],
                [userId]
              );

              //Prep Parent & Student Grade Group
              let prepGroupLearnerAndParentsGrade =
                filteredClass?.grade?.gradeName +
                " " +
                studentRoleName +
                " & " +
                parentRoleName;
              amendPreGroupCreation(
                prepGroupLearnerAndParentsGrade,
                [parentId2],
                [userId]
              );

              amendPreGroupCreation("BROADCAST", [parentId2], [userId]);

              // Prep ALL PARENTS
              amendPreGroupCreation("ALL PARENTS", [parentId2], [userId]);
              // Prep Parents of Grade Group
              amendPreGroupCreation(
                filteredClass?.grade?.gradeName + " " + parentRoleName,
                [parentId2],
                [userId]
              );

              parentArr.push({
                id: parentId2,
                firstName: csvData[i]?.[headersSelected[10]],
                lastName: csvData[i]?.[headersSelected[11]],
                email: csvData[i]?.[headersSelected[13]] || "",
                phoneNumber: csvData[i]?.[headersSelected[12]] || "",
                contactable: "private",
                classId: filteredClass ? filteredClass.id : null,
                userRoleId: parentRoleId,
                userModelLinkedUserId: learnerId,
              });
            }
          }
        }
        setNewGroupPrepared(tempNewGroupPrepared);

        let tenantId = await store.get(TENANT_ID);
        if (learnerArr?.length) {
          // setShowProgress(true);
          let i,
            j,
            chunks,
            chunkSize = 100;
          percent = 20;
          let learnerResp: any[] = [];
          for (i = 0, j = learnerArr.length; i < j; i += chunkSize) {
            chunks = learnerArr.slice(i, i + chunkSize);
            console.log("chunks ", chunks);
            let respUploads = await integration.bulkUserUpload(
              tenantId,
              chunks
            );
            learnerResp.push(respUploads?.items);
            percent = 10 + ((i + chunkSize) / learnerArr.length) * 80 * 0.5;
            setProgressPercent(parseInt(percent.toString()));
          }

          let parentResp: any[] = [];
          let percentParent = percent;
          if (parentArr?.length) {
            for (i = 0, j = parentArr.length; i < j; i += chunkSize) {
              chunks = parentArr.slice(i, i + chunkSize);
              let respUploads = await integration.bulkUserUpload(
                tenantId,
                chunks
              );
              parentResp.push(respUploads?.items);
              percentParent =
                percent + 10 + ((i + 1) / parentArr.length) * 80 * 0.5;

              setProgressPercent(parseInt(percentParent.toString()));
            }
          }
          console.log(" ##### newGroupPrepared ", newGroupPrepared);
          resolve([...learnerResp, ...parentResp]);

          // let learnerResp = await integration.bulkUserUpload(tenantId, learnerArr);
          // let parentResp: any[] = [];
          // if (parentArr?.length) {
          //   parentResp = await integration.bulkUserUpload(tenantId, parentArr);
          // }
          // resolve([...learnerResp, ...parentResp]);
        } else {
          resolve(null);
        }
      } catch (err) {
        reject(err);
      } finally {
        setBtnLoading(false);
      }
    });
  };

  const amendPreGroupCreation = (
    prepGroupName: string,
    newUserIds: any[],
    adminUsers: any[]
  ) => {
    //console.log("amendPreGroupCreation prepGroupName ", prepGroupName);
    let foundGroup = tempNewGroupPrepared.find(
      (group: any) => group.groupName === prepGroupName
    );
    //console.log("amendPreGroupCreation foundGroup ", foundGroup);

    if (foundGroup && foundGroup !== null && foundGroup.groupName) {
      foundGroup.groupMembers = [...foundGroup.groupMembers, ...newUserIds];
      for (let i = 0; i < adminUsers.length; i++) {
        let isAdminUserFound = foundGroup.groupAdminUsers.find(
          (value: any) => value === adminUsers[i]
        );
        if (isAdminUserFound === undefined || isAdminUserFound === null) {
          foundGroup.groupAdminUsers = [
            ...foundGroup.groupAdminUsers,
            adminUsers[i],
          ];
        }
      }
      //console.log("amendPreGroupCreation UPDATE");
    } else {
      //console.log("amendPreGroupCreation ADD");
      tempNewGroupPrepared.push({
        groupName: prepGroupName,
        groupMembers: [...newUserIds],
        groupAdminUsers: [...adminUsers],
      });
    }
    //console.log("amendPreGroupCreation newGroupPrepared ", newGroupPrepared);
  };

  const prepareStaffImportGradeAndClass = async (csvData: any) => {
    let retClasses = await integration.listClassesInfo(undefined);
    let classes = retClasses.items;
    for (let i = 1; i < csvData.length; i++) {
      let classItem = classes.find((value: any) => {
        return value.className?.toLowerCase() === csvData[i][7]?.toLowerCase();
      });

      let newClassItem = newBulkClasses.find((value: any) => {
        return value.className?.toLowerCase() === csvData[i][7]?.toLowerCase();
      });

      if (!classItem && !newClassItem) {
        let gradeItem = classes.find((value: any) => {
          return (
            value.gradeName?.toLowerCase() === csvData[i][6]?.toLowerCase()
          );
        });

        let newGradeItem = newBulkGrades.find((value: any) => {
          console.log("|||||||New value:", value);

          console.log(
            "|||||||New value.grade.gradeName:",
            value.gradeName,
            " csvData[i][6] ",
            csvData[i][6]
          );

          return (
            value.gradeName?.toLowerCase() === csvData[i][6]?.toLowerCase()
          );
        });
        console.log("gradeItem:", gradeItem, " csvData[i][6] :", csvData[i][6]);
        console.log("newGradeItem:", newGradeItem);

        if (gradeItem || newGradeItem) {
          if (gradeItem) {
            newBulkClasses.push({
              id: uuid(),
              gradeId: gradeItem.gradeId,
              className: csvData[i][7],
            });
          }
          if (newGradeItem) {
            newBulkClasses.push({
              id: uuid(),
              gradeId: newGradeItem.id,
              className: csvData[i][7],
            });
          }
        } else {
          let newGradeId = uuid();
          newBulkGrades.push({ id: newGradeId, gradeName: csvData[i][6] });
          newBulkClasses.push({
            id: uuid(),
            gradeId: newGradeId,
            className: csvData[i][7],
          });
        }
        console.log("***** gradeItem:", gradeItem);
      }
    }
    console.log("***** newBulkClasses:", newBulkClasses);
    console.log("***** newBulkGrades:", newBulkGrades);

    let promiseGrades = [];
    let promiseClasses = [];

    if (newBulkGrades.length > 0) {
      promiseGrades.push(integration.bulkGradeUpload(newBulkGrades));
    }
    if (newBulkClasses.length > 0) {
      promiseClasses.push(integration.bulkClassNameUpload(newBulkClasses));
    }

    if (promiseGrades.length > 0 || promiseClasses.length > 0) {
      let respGrades = await Promise.all(promiseGrades);
      let respClasses = await Promise.all(promiseClasses);
      for (let i = 0; i < respClasses[0].length; i++) {
        let grade = respGrades[0].find((value: any) => {
          console.log(
            "&&&& value  ",
            value,
            " respClasses[0][i].gradeID ",
            respClasses[0][i].gradeID
          );
          return value.id === respClasses[0][i].gradeID;
        });
        respClasses[0][i].grade = grade;
      }
      console.log("***** respGrades :", respGrades);
      console.log("***** respClasses :", respClasses);

      if (respClasses.length > 0) {
        classes.push(...respClasses[0].items);
      }
      console.log("***** classes:", classes);
      //console.log("***** classes After Update :", classes)
    }
  };
  const prepareGradeAndClass = async (csvData: any) => {
    let percent = 3;
    setProgressPercent(parseInt(percent.toString()));
    console.log("***** prepareGradeAndClass classes: ", classes);

    for (let i = 1; i < csvData.length; i++) {
      let classItem = classes.find((value: any) => {
        return value.className?.toLowerCase() === csvData[i][4]?.toLowerCase();
      });

      let newClassItem = newBulkClasses.find((value: any) => {
        return value.className?.toLowerCase() === csvData[i][4]?.toLowerCase();
      });

      console.log("***** newClassItem:", classItem);
      console.log("***** gradeName: ", csvData[i][3]?.toLowerCase());

      if (!classItem && !newClassItem) {
        let gradeItem = classes.find((value: any) => {
          console.log(
            "Existing value.gradeName:",
            value.gradeName,
            " csvData[i][3] ",
            csvData[i][3]
          );

          return (
            value.gradeName?.toLowerCase() === csvData[i][3]?.toLowerCase()
          );
        });

        let newGradeItem = newBulkGrades.find((value: any) => {
          console.log("|||||||New value:", value);

          console.log(
            "|||||||New value.grade.gradeName:",
            value.gradeName,
            " csvData[i][3] ",
            csvData[i][3]
          );

          return (
            value.gradeName?.toLowerCase() === csvData[i][3]?.toLowerCase()
          );
        });
        console.log("gradeItem:", gradeItem);
        console.log("newGradeItem:", newGradeItem);

        if (gradeItem || newGradeItem) {
          if (gradeItem) {
            newBulkClasses.push({
              id: uuid(),
              gradeId: gradeItem.id,
              className: csvData[i][4],
            });
          }
          if (newGradeItem) {
            newBulkClasses.push({
              id: uuid(),
              gradeId: newGradeItem.id,
              className: csvData[i][4],
            });
          }
        } else {
          let newGradeId = uuid();
          newBulkGrades.push({ id: newGradeId, gradeName: csvData[i][3] });
          newBulkClasses.push({
            id: uuid(),
            gradeId: newGradeId,
            className: csvData[i][4],
          });
        }
        console.log("***** gradeItem:", gradeItem);
      }
    }
    //console.log("***** newBulkClasses:", newBulkClasses)
    //console.log("***** newBulkGrades:", newBulkGrades)
    await store.create();

    let tenantId = await store.get(TENANT_ID);

    let promiseGrades = [];
    let promiseClasses = [];

    if (newBulkGrades.length > 0) {
      promiseGrades.push(integration.bulkGradeUpload(newBulkGrades));
    }
    if (newBulkClasses.length > 0) {
      promiseClasses.push(integration.bulkClassNameUpload(newBulkClasses));
    }
    percent = 6;
    setProgressPercent(parseInt(percent.toString()));

    if (promiseGrades.length > 0 || promiseClasses.length > 0) {
      let respGrades = await Promise.all(promiseGrades);
      let respClasses = await Promise.all(promiseClasses);
      console.log("****** respGrades ", respGrades);
      console.log("****** respClasses ", respClasses);
      if (respGrades.length > 0) {
        for (let i = 0; i < respClasses[0].items.length; i++) {
          let grade = respGrades[0].items.find((value: any) => {
            console.log(
              "&&&& value  ",
              value,
              " respClasses[0][i].gradeID ",
              respClasses[0].items[i].gradeId
            );
            return value.id === respClasses[0].items[i].gradeId;
          });

          respClasses[0].items[i].grade = grade;
        }
      }

      console.log("***** respGrades :", respGrades);
      console.log("***** respClasses :", respClasses);

      percent = 20;
      setProgressPercent(parseInt(percent.toString()));

      if (respClasses[0].items.length > 0) {
        classes.push(...respClasses[0].items);
      }
      console.log("***** classes:", classes);
      //console.log("***** classes After Update :", classes)
    }
  };

  function validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  const handleNext = async () => {
    if (type === "learner") {
      if (step === 1) {
        var props = [0, 1, 2, 3];
        var hasAll = props.every((prop) =>
          headersSelected.hasOwnProperty(prop)
        );
        console.log(" headersSelected ", headersSelected, " hasAll ", hasAll);
        setProgressPercent(0);

        if (hasAll) {
          let phone = csvData[1]?.[headersSelected[4]];
          let email = csvData[1]?.[headersSelected[5]];
          let flagEmail = true;
          let flagPhone = true;
          let message = "";
          if (email) {
            let isValidEmail = validateEmail(email);
            flagEmail = isValidEmail;
            if (!flagEmail) {
              message = "Please put valid email";
            }
          }
          if (phone) {
            flagPhone = !isNaN(phone);
            if (!flagPhone) {
              message = "Please put valid phone";
            }
          }
          if (flagEmail && flagPhone) {
            //setStep(VALIDATE_LEARNER_DATA)
            setStep(2);
          } else {
            present({
              message,
              buttons: [
                { text: "Ok", handler: (d) => console.log("ok pressed") },
              ],
            });
          }
        } else {
          present({
            message: `Please map all the required columns!`,
            buttons: [
              { text: "Ok", handler: (d) => console.log("ok pressed") },
            ],
          });
        }
      } else if (step === 2) {
        var props = [6, 7];
        var hasAll = props.every((prop) =>
          headersSelected.hasOwnProperty(prop)
        );
        if (hasAll) {
          let phone = csvData[1]?.[headersSelected[8]];
          let email = csvData[1]?.[headersSelected[9]];
          let flagEmail = true;
          let flagPhone = true;
          let message = "";
          if (email) {
            let isValidEmail = validateEmail(email);
            flagEmail = isValidEmail;
            if (!flagEmail) {
              message = "Please put valid email";
            }
          }
          if (phone) {
            flagPhone = !isNaN(phone);
            if (!flagPhone) {
              message = "Please put valid phone";
            }
          }
          if (flagEmail && flagPhone) {
            setStep(3);
          } else {
            present({
              message,
              buttons: [
                { text: "Ok", handler: (d) => console.log("ok pressed") },
              ],
            });
          }
        } else {
          present({
            message: `Please map all the required columns!`,
            buttons: [
              { text: "Ok", handler: (d) => console.log("ok pressed") },
            ],
          });
        }
      } else {
        var props = [10, 11];
        var hasAll = props.every((prop) =>
          headersSelected.hasOwnProperty(prop)
        );
        if (hasAll) {
          let phone = csvData[1]?.[headersSelected[12]];
          let email = csvData[1]?.[headersSelected[13]];
          let flagEmail = true;
          let flagPhone = true;
          let message = "";
          if (email) {
            let isValidEmail = validateEmail(email);
            flagEmail = isValidEmail;
            if (!flagEmail) {
              message = "Please put valid email";
            }
          }
          if (phone) {
            flagPhone = !isNaN(phone);
            if (!flagPhone) {
              message = "Please put valid phone";
            }
          }
          if (flagEmail && flagPhone) {
            const resp = await handleImportLearner();
            contactsResetContacts();
            setTimeout(() => {
              fetchContacts(null, filter);
              console.log("handleNext tenantId ", tenantId);
              fetchClasses(tenantId);
              fetchGrades(undefined);
              console.log("setTimeout fetchGrades");
            }, 2000);
            closee();
            done(
              resp,
              newBulkGrades.length,
              newBulkClasses.length,
              newGroupPrepared.length > 0
                ? newGroupPrepared
                : tempNewGroupPrepared
            );
          } else {
            present({
              message,
              buttons: [
                { text: "Ok", handler: (d) => console.log("ok pressed") },
              ],
            });
          }
        } else {
          present({
            message: `Please map all the required columns!`,
            buttons: [
              { text: "Ok", handler: (d) => console.log("ok pressed") },
            ],
          });
        }
      }
    } else {
      var props = [0, 1, 2, 3];
      var hasAll = props.every((prop) => headersSelected.hasOwnProperty(prop));
      if (hasAll) {
        let phone = csvData[1]?.[headersSelected[3]];
        let email = csvData[1]?.[headersSelected[4]];
        let flagEmail = true;
        let flagPhone = true;
        let message = "";
        if (email) {
          let isValidEmail = validateEmail(email);
          flagEmail = isValidEmail;
          if (!flagEmail) {
            message = "Please put valid email";
          }
        }
        if (phone) {
          flagPhone = !isNaN(phone);
          if (!flagPhone) {
            message = "Please put valid phone";
          }
        }
        if (flagEmail && flagPhone) {
          const resp = await handleImportStaff();
          contactsResetContacts();
          setTimeout(() => {
            fetchContacts(null, filter);
          }, 2000);
          closee();
          done(
            resp,
            newBulkGrades.length,
            newBulkClasses.length,
            newGroupPrepared.length > 0
              ? newGroupPrepared
              : tempNewGroupPrepared
          );
        } else {
          present({
            message,
            buttons: [
              { text: "Ok", handler: (d) => console.log("ok pressed") },
            ],
          });
        }
      } else {
        present({
          message: `Please map all the required columns!`,
          buttons: [{ text: "Ok", handler: (d) => console.log("ok pressed") }],
        });
      }
    }
  };
  useEffect(() => {
    if (!open) {
      setHeadersSelected({});
      setStep(1);
      setHeadersMod([]);
      setList([]);
      setProgressPercent(0);
    }
  }, [open]);
  useEffect(() => {
    console.log(headersSelected);
  }, [headersSelected]);

  const validateLearnerData = () => {
    console.log(" headersSelected ", headersSelected);
    console.log(" csvData ", csvData);
    let errorList = [];
    for (let index = 0; index < csvData.length; index++) {
      let learnerFirstName = csvData[index][headersSelected[0]];
      let learnerLastName = csvData[index][headersSelected[1]];
      let learnerGrade = csvData[index][headersSelected[2]];
      let learnerClass = csvData[index][headersSelected[3]];
      let arrayList = [];
      let isErrorFound = false;
      if (learnerFirstName === undefined || learnerFirstName.length < 1) {
        arrayList.push({ columnId: 0, errorMessage: "Missing First Name" });
        isErrorFound = true;
      }
      if (learnerLastName === undefined || learnerLastName.length < 1) {
        arrayList.push({ columnId: 1, errorMessage: "Missing Last Name" });
        isErrorFound = true;
      }
      if (learnerGrade === undefined || learnerGrade.length < 1) {
        arrayList.push({ columnId: 2, errorMessage: "Missing Learner Grade" });
        isErrorFound = true;
      }
      if (learnerClass === undefined || learnerClass.length < 1) {
        arrayList.push({ columnId: 3, errorMessage: "Missing Learner Class" });
        isErrorFound = true;
      }

      if (isErrorFound) {
        errorList.push({ data: csvData[index], error: arrayList });
      }
    }

    return errorList;
  };

  // const NameCell = ({ rowData:any, dataKey:any, ...props }) => {
  //   const speaker = (
  //     <Popover title="Description">
  //       <p>
  //         <b>Name:</b> {rowData.name}
  //       </p>
  //       <p>
  //         <b>Gender:</b> {rowData.gender}
  //       </p>
  //       <p>
  //         <b>City:</b> {rowData.city}
  //       </p>
  //       <p>
  //         <b>Street:</b> {rowData.street}
  //       </p>
  //     </Popover>
  //   );

  const validateLearnerDataView = () => {
    let errorInfo = validateLearnerData();
    console.log("validateLearnerDataView errorList ", errorInfo);
    console.log(
      "validateLearnerDataView headers.slice(0,8) ",
      headers.slice(0, 8)
    );

    rowsWithError = [];
    for (let index = 0; index < errorInfo.length; index++) {
      let data = errorInfo[index].data;
      let item: any = {};
      for (let j = 0; j < 7; j++) {
        item[createKey(headers[j])] = data[j].length === 0 ? "Empty" : data[j];
      }
      rowsWithError.push(item);
    }
    console.log(
      "validateLearnerDataView rowsWithError ",
      rowsWithError,
      " headers.slice(0,7) ",
      headers.slice(0, 7)
    );

    return (
      <Panel
        header={
          <>
            <Icon size="2x" style={{ color: "red" }} icon="warning" /> Learner
            Missing info (click to details)
          </>
        }
        collapsible
        bordered
        bodyFill
        className="drag-cancel"
      >
        <Table
          data={rowsWithError}
          //  style={{ color: 'red' }}
        >
          {/* <Column width={100} align="left">
              <HeaderCell>id</HeaderCell>
              <Cell dataKey="id" />
          </Column> 
          <Column width={100} align="left">
              <HeaderCell>First Name</HeaderCell>
              <Cell dataKey="firstName" />
          </Column>  */}
          {headers.slice(0, 7).map((value, index) => (
            <Column width={index === 0 ? 40 : 140} align="left">
              <HeaderCell>{value}</HeaderCell>
              <EditableCell dataKey={createKey(value)} />
            </Column>
          ))}
        </Table>
      </Panel>
    );
  };

  const createKey = (value: string) => {
    let key = value.replaceAll(" ", "");
    key = key.replaceAll("(", "");
    key = key.replaceAll(")", "");

    return key.toLowerCase();
  };
  const handleChange = (id: any, key: any, value: any) => {
    const nextData: any = Object.assign([], data);
    nextData.find((item: any) => item.id === id)[key] = value;
    rowsWithError.push(nextData);
  };
  const EditableCell = ({ rowData, dataKey, onChange, ...props }: any) => {
    console.log("EditableCell rowData ", rowData);
    const speaker = (
      <Popover title="Error">
        <p>Missing information</p>
      </Popover>
    );
    //
    return (
      <Cell {...props}>
        {rowData[dataKey] === "Empty" ? (
          <Whisper placement="top" speaker={speaker}>
            <a>{rowData[dataKey]}</a>
          </Whisper>
        ) : (
          <span className="table-content-edit-span">{rowData[dataKey]}</span>
        )}
      </Cell>
    );
  };

  return (
    <Draggable defaultPosition={{ x: 0, y: 0 }} cancel=".drag-cancel">
      <IonItem
        lines="none"
        className="columnMapping"
        style={{ display: open ? "block" : "none" }}
      >
        <FlexboxGrid style={{ flexDirection: "column", width: "100%" }}>
          <FlexboxGrid
            justify="space-between"
            style={{
              width: "100%",
              borderBottom: "1px solid #bbb",
              paddingBottom: 10,
            }}
          >
            <IonText
              style={{
                color: "#219653",
                fontSize: 21,
              }}
            >
              {type === "learner"
                ? step === 1
                  ? "Map Learner Information"
                  : step === 2
                  ? "Map Parent 1 Information"
                  : step === VALIDATE_LEARNER_DATA
                  ? "Checking Learner information..."
                  : step === VALIDATE_PARENT_1_DATA
                  ? "Checking Parent 1 information..."
                  : step === 3
                  ? "Map Parent 2 Information"
                  : step === VALIDATE_PARENT_2_DATA
                  ? "Checking Parent 2 information..."
                  : "Map Parent 2 Information"
                : "Map Staff Information"}
            </IonText>
            <IonIcon
              icon={close}
              style={{
                fontSize: 22,
                verticalAlign: "top",
                color: "#bf0000",
              }}
              onClick={closee}
              className="drag-cancel"
            />
          </FlexboxGrid>

          {step < 4 ? (
            <>
              <FlexboxGrid justify="space-between" className="colMapRow">
                <div className="coll-1" style={{ margin: "15px 0px" }}>
                  <IonText className="columnMappingHeader">
                    Expected Fields
                  </IonText>
                </div>
                <div className="coll-2" style={{ margin: "15px 0px" }}>
                  <IonText className="columnMappingHeader">
                    Excel Header
                  </IonText>
                </div>
                <div className="coll-3" style={{ margin: "15px 0px" }}>
                  <IonText className="columnMappingHeader">
                    Excel Sample Data
                  </IonText>
                </div>
              </FlexboxGrid>
              {list.map((place, i) => (
                <FlexboxGrid
                  justify="space-between"
                  className="colMapRow drag-cancel"
                  key={i}
                >
                  <div className="coll-1">
                    <IonText style={{ fontSize: 14 }}>{place.input}</IonText>
                  </div>
                  <div className="coll-2">
                    <InputPicker
                      className="PopupInputPicker drag-cancel"
                      placeholder={place.select}
                      data={headersMod}
                      preventOverflow
                      onSelect={(value) => {
                        setHeadersSelected({
                          ...headersSelected,
                          [type === "learner"
                            ? step === 1
                              ? i
                              : step === 2
                              ? i + 6
                              : i + 10
                            : i]: value.i,
                        });
                      }}
                      key={step}
                    />
                  </div>
                  <div className="coll-3">
                    <Input
                      placeholder={place.input}
                      value={
                        csvData[1]?.[
                          headersSelected[
                            type === "learner"
                              ? step === 1
                                ? i
                                : step === 2
                                ? i + 6
                                : i + 10
                              : i
                          ]
                        ] || ""
                      }
                    />
                  </div>
                </FlexboxGrid>
              ))}
              <IonText className="columnMappingText">
                {type === "learner"
                  ? step === 1
                    ? "Please map learner's information"
                    : step === 2
                    ? "Please map first parent/guardian information"
                    : "Please map second parent/guardian information"
                  : "Please map staff's information"}
              </IonText>

              {showProgress && <Line percent={progressPercent} />}
            </>
          ) : (
            <>
              <FlexboxGrid
                className="colMapRow"
                style={{
                  width: "100%",
                  paddingTop: 10,
                }}
              >
                <FlexboxGrid.Item colspan={24}>
                  {validateLearnerDataView()}
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </>
          )}

          <FlexboxGrid justify="end" style={{ width: "100%", marginTop: 20 }}>
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
                onClick={() => handleNext()}
                disabled={btnLoading}
                id={"btnMapNext" + step}
              >
                {btnLoading ? <IonSpinner name="dots" /> : "Next"}
              </IonButton>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </FlexboxGrid>
      </IonItem>
    </Draggable>
  );
};
const mapStateToProps = (state: any) => ({
  roles: state.roles.roles,
  classes: state.classes.classes,
  filter: state.contacts.filter,
});
const mapDispatchToProps = {
  fetchContacts,
  contactsResetContacts,
  fetchGrades,
  fetchClasses,
};
export default connect(mapStateToProps, mapDispatchToProps)(ColumnMapping);
