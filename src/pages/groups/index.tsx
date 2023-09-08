import React, { useState, useEffect } from "react";
import { Analytics } from "aws-amplify";

import {
  IonIcon,
  IonButton,
  IonText,
  IonCheckbox,
  IonSpinner,
  IonImg,
  useIonAlert,
} from "@ionic/react";
import { search, add, chevronDown, trash, funnel, close } from "ionicons/icons";
import "./groups.css";
import GroupChart from "../../components/groups/groupChart/groupChart";
import NewGroup from "../../components/groups/newGroup/newGroup";
import { FlexboxGrid, InputPicker } from "rsuite";
import GroupSuccess from "../../components/groups/groupSuccess/groupSuccess";
import Swal from "sweetalert2";
import InfiniteScroll from "react-infinite-scroller";

//redux
import { connect } from "react-redux";
import { fetchGroups, groupRemoveData } from "../../stores/groups/actions";
import { isConstructorDeclaration } from "typescript";
import { group } from "console";
import * as integration from "scholarpresent-integration";
import useHandleNotification from "../../hooks/useHandleNotification";
import useGetCacheTenantId from "../../hooks/useGetCacheTenantId";

const GroupPage: React.FC<{
  fetchGroups: Function;
  groups: any;
  groupRemoveData: Function;
}> = ({ fetchGroups, groups, groupRemoveData }) => {
  const [present] = useIonAlert();
  const [newGroup, setNewGroup] = useState<boolean>(false);
  const [editGroup, setEditGroup] = useState<boolean>(false);

  const [groupSuccess, setGroupSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [groupsDup, setGroupsDup] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<any>([]);
  const [searchAutocompleteLoading, setSearchAutocompleteLoading] =
    useState<boolean>(false);
  const [searchSelectedItem, setSearchSelectedItem] = useState<any>({});
  const [deleteRow, setDeleteRow] = useState<any>(null);
  const [selectedGroups, setSelectedGroups] = useState<any>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>({});
  const [selectedId, setSelectedId] = useState(null);
  const [groupNextToken, setGroupNextToken] = useState<any>();
  let tenantId: string = useGetCacheTenantId();

  const [lastNativeNotification, lastWebNotification] = useHandleNotification();

  const handleFetchGroups = async (nextToken: any) => {
    console.log("handleFetchGroups nextToken ", nextToken);
    try {
      setLoading(true);
      let grps = null;
      if (nextToken) {
        grps = await fetchGroups(nextToken);
      } else {
        grps = await fetchGroups();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const handleSearchGroups = async (e: any) => {
    e.preventDefault();

    if (searchText.length === 0) {
      handleClearSearch();
    } else {
      try {
        setSearchLoading(true);
        if (searchSelectedItem.type === "group") {
          const resp = await integration.searchByGroupName(searchText);
          if (Array.isArray(resp.items)) {
            setGroupsDup(resp.items);
          }
        } else {
          let memberGroups = await integration.findUserBelongToGroup(
            searchSelectedItem.id
          );
          console.log("||||||| memberGroups:", memberGroups);
          let mergedGroups = [...memberGroups.items];
          setGroupsDup(mergedGroups);
        }
      } catch (err) {
      } finally {
        setSearchLoading(false);
      }
    }
  };
  const handleSearchGroupsOnClickRow = async (item: any) => {
    try {
      setSearchText(item.title);
      setSearchSelectedItem(item);
      setSearchLoading(true);
      if (item.type === "group") {
        const resp = await integration.searchByGroupName(item.title);
        console.log("***handleSearchGroupsOnClickRow ", resp);
        if (Array.isArray(resp.items)) {
          setGroupsDup(resp.items);
        }
      } else {
        let memberGroups = await integration.findUserBelongToGroup(item.id);

        let mergedGroups = [...memberGroups.items];
        setSelectedId(item.id);
        setGroupsDup(mergedGroups);
      }
      setSearchResults([]);
    } catch (err) {
    } finally {
      setSearchLoading(false);
    }
  };
  const fetchGroupsSuggestions = async (text: string) => {
    try {
      setSearchAutocompleteLoading(true);
      let searchResultsArr: any[] = [];
      //search by group name
      const resp = await integration.searchByGroupName(text);
      if (Array.isArray(resp.items)) {
        resp.items.map((item: any) => {
          searchResultsArr.push({
            id: item.id,
            type: "group",
            title: item.groupName,
            role: "Group",
          });
        });
      }
      //search by group member/admin name
      const resp2 = await integration.searchUserByFirstOrLastName(
        tenantId,
        text
      );
      if (Array.isArray(resp2.items)) {
        resp2.items.map((item: any) => {
          searchResultsArr.push({
            id: item.id,
            type: "member",
            title: `${item.firstName} ${item.lastName}`,
            role: item.userRole?.roleName,
          });
        });
      }
      setSearchResults(searchResultsArr);
    } catch (err) {
    } finally {
      setSearchAutocompleteLoading(false);
    }
  };
  const handleSelectSearchResult = async (item: any) => {
    setSearchText(item.title);
    setSearchSelectedItem(item);
    setSearchResults([]);
  };
  const handleClearSearch = () => {
    setSelectedId(null);
    setSearchText("");
    setSearchSelectedItem({});
    setSearchResults([]);
    setGroupsDup(groups.items);
  };
  useEffect(() => {
    console.log("Loading group mfe");

    if (groups?.items?.length > 0) {
      console.log("First Already loaded ", groups?.items?.length);
    } else {
      handleFetchGroups(groupNextToken);
    }
  }, []);
  useEffect(() => {
    if (groups.items) {
      if (groupNextToken != null && groupNextToken.length > 0) {
        setGroupsDup([...groupsDup, ...groups.items]);
        setGroupNextToken(groups.nextToken);
      } else {
        setGroupsDup([...groups.items]);
        setGroupNextToken(groups.nextToken);
      }
    } else {
      setGroupsDup([...groups]);
    }
    Analytics.record({ name: "view-group", attributes: { action: "load" } });
  }, [groups]);
  useEffect(() => {
    if (searchSelectedItem?.title !== searchText) {
      if (searchText.length >= 3) {
        fetchGroupsSuggestions(searchText);
      } else {
        setSearchResults([]);
        setSearchSelectedItem({});
      }
    }
  }, [searchText]);

  const handleSelectRow = (item: any, checked: boolean, bulkSelect: any) => {
    //console.log("****** handleSelectRow ****** item ", item," checked ", checked )
    console.log("****** handleSelectRow ****** bulkSelect ", bulkSelect);
    if (bulkSelect) {
      //setSelectedGroups(bulkSelect)
    } else if (checked) {
      if (selectedGroups.length > 0) {
        let newArray = [];
        let isItemFound = false;
        for (let i = 0; i < selectedGroups.length; i++) {
          if (selectedGroups[i]?.id === item?.id) {
            isItemFound = true;
            break;
          }
        }
        if (!isItemFound) {
          setSelectedGroups([...selectedGroups, item]);
        }
      } else {
        setSelectedGroups([item]);
      }
    } else {
      if (selectedGroups.length > 0) {
        let newArray = [];
        for (let i = 0; i < selectedGroups.length; i++) {
          if (selectedGroups[i]?.id !== item?.id) {
            newArray.push(selectedGroups[i]);
          }
        }
        setSelectedGroups(newArray);
      } else {
        setSelectedGroups([]);
      }
      //setSelectedGroups([...selectedGroups])
    }
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      console.log("handleSelectAll groups ", groupsDup);
      if (Array.isArray(groupsDup)) {
        handleSelectRow(null, checked, groupsDup);
        //setSelectedGroups(groups);
      } else {
        handleSelectRow(null, checked, groupsDup?.items);
        //setSelectedGroups(groups?.items);
      }
    } else {
      handleSelectRow(null, checked, []);
    }
  };
  const handleDeleteGroupBulk = async () => {
    present({
      message: `Are you sure want to delete these groups?`,
      buttons: [
        {
          text: "Ok",
          handler: async (d) => {
            let groupIds = selectedGroups.map((grp: any) => grp.id);
            if (groupIds.length === 0) {
              present({
                message: `Select groups to delete`,
              });
              return;
            }
            try {
              setLoading(true);
              let groupDeleted = await integration.bulkGroupDeleteInfo(
                groupIds
              );
              if (groupDeleted?.items.length > 0) {
                groupRemoveData(groupIds);
              }
              setSelectedGroups([]);
            } catch (err) {
              console.log("err ", err);
              // Swal.fire(
              //   "Something went wrong!",
              //   "Please try again after sometime",
              //   "error"
              // );
            } finally {
              setLoading(false);
            }
          },
        },
        {
          text: "Cancel",
          handler: async (d) => {
            console.log("cancel...");
          },
        },
      ],
      onDidDismiss: (e) => console.log("did dismiss"),
    });

    // Swal.fire({
    //   title: "Are you sure want to delete these groups?",
    //   text: "This action is unrecoverable!",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes, delete it!",
    //   cancelButtonText: "No, keep it",
    // }).then(async (result: any) => {
    //   if (result.isConfirmed) {
    //     let groupIds = selectedGroups.map((grp: any) => grp.id);
    //     try {
    //       setLoading(true);
    //       await integration.bulkGroupDeleteInfo(groupIds);
    //       groupRemoveData(groupIds);
    //     } catch (err) {
    //       Swal.fire(
    //         "Something went wrong!",
    //         "Please try again after sometime",
    //         "error"
    //       );
    //     } finally {
    //       setLoading(false);
    //     }
    //   }
    // });
  };

  const handleGroupHasMore = () => {
    return groupNextToken != null;
  };
  return (
    <>
      <FlexboxGrid className="searchBar">
        <FlexboxGrid.Item className="search">
          {/* <IonIcon
            icon={funnel}
            style={{
              fontSize: 18,
              verticalAlign: "middle",
              marginLeft: 5,
            }}
          />
          <InputPicker
            searchable={false}
            data={data}
            className="aboveTableSelect"
            placeholder="Groups"
          />
          <div className="divider" /> */}
          <form action="" onSubmit={handleSearchGroups}>
            <input
              type="search"
              placeholder="e.g. All Parents, Maria"
              value={searchText}
              onChange={(e) => {
                console.log("search e ", e);
                if (e.target.value?.length === 0) {
                  handleClearSearch();
                } else {
                  setSearchText(e.target.value);
                }
              }}
              // style={{ width: 200 }}
              className="search-input"
            />
            {searchResults.length > 0 && (
              <FlexboxGrid className="searchSuggestions" justify="space-around">
                {searchResults.map((item: any, i: number) => (
                  <FlexboxGrid
                    className="searchSuggestionsItems"
                    key={i}
                    onClick={() => handleSearchGroupsOnClickRow(item)}
                    justify="space-between"
                  >
                    <FlexboxGrid.Item className="TextGreen textBold">
                      <IonImg
                        src={
                          item.role === "Group"
                            ? "/assets/group.png"
                            : item.role === "Student"
                            ? "/assets/learner.png"
                            : item.role === "Parent"
                            ? "/assets/familyOne.png"
                            : "/assets/teacher.png"
                        }
                        className="groupAdminsIcon"
                        style={{
                          width: "10%",
                          margin: "0 12px",
                          verticalAlign: "middle",
                        }}
                      />
                      {item.title}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="TextGreen ">
                      {item.role}
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                ))}
              </FlexboxGrid>
            )}
            {searchSelectedItem?.id?.length > 0 && (
              <IonIcon
                icon={close}
                style={{
                  fontSize: 20,
                  verticalAlign: "middle",
                  paddingRight: 10,
                  cursor: "pointer",
                }}
                onClick={() => handleClearSearch()}
              />
            )}
            <IonButton
              className="outlineBtn btn-green"
              type="submit"
              disabled={searchLoading}
            >
              {searchLoading || searchAutocompleteLoading ? (
                <IonSpinner name="dots" />
              ) : (
                <IonIcon
                  icon={search}
                  style={{ fontSize: 20, verticalAlign: "middle" }}
                />
              )}
            </IonButton>
          </form>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <IonButton
            fill="outline"
            className="outlineBtn btn-trash"
            onClick={() => handleDeleteGroupBulk()}
            disabled={selectedGroups?.length === 0}
          >
            <IonIcon
              icon={trash}
              style={{
                fontSize: 20,
                verticalAlign: "middle",
                color: "#bf0000",
              }}
            />
          </IonButton>
          <IonButton
            fill="outline"
            className="outlineBtn btn-right btn-addGroup"
            onClick={() => {
              console.log(">>>> newGroup ", newGroup);
              setNewGroup(!newGroup);
              setEditGroup(false);
            }}
          >
            <IonIcon
              icon={add}
              size="large"
              style={{
                fontSize: 22,
                verticalAlign: "middle",
                color: "#219653",
                marginRight: 7,
              }}
            />
            <IonText>Add Group</IonText>
          </IonButton>
        </FlexboxGrid.Item>
        <NewGroup
          open={newGroup}
          edit={editGroup}
          close={() => {
            setNewGroup(!newGroup);
          }}
          save={(count: number) => {
            setGroupSuccess(!groupSuccess);
            setMemberCount(count);
          }}
          groupInfo={selectedGroup}
        />
      </FlexboxGrid>
      <FlexboxGrid
        lines="none"
        className="groupHead"
        style={{
          display: "flex",
          //justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <FlexboxGrid.Item colspan={24} md={6}>
          {/* 
        <IonCheckbox
          className="groupCheck"
          onIonChange={(e) => {
            handleSelectAll(e.detail.checked)
          }}
        /> */}
          <IonText className="groupBodyText">
            Group Name (Count: {groupsDup?.length})
          </IonText>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <div style={{ textAlign: "center" }}>
        {loading && (
          <IonSpinner
            name="bubbles"
            style={{ margin: "auto", transform: "scale(1.5)" }}
            color="success"
          />
        )}
      </div>

      <FlexboxGrid className="groupMain">
        <FlexboxGrid className="groupBodyCover">
          {groupsDup?.map &&
            groupsDup?.map((group: any, i: number) => (
              <GroupChart
                selectedId={selectedId}
                key={i}
                id={i}
                SetDelete={() => {
                  setDeleteRow(i);
                }}
                selectedDelete={deleteRow}
                group={group}
                onSelect={(item: any, checked: boolean) => {
                  console.log("onSelect ", selectedGroups);
                  handleSelectRow(item, checked, undefined);
                }}
                selectedGroups={selectedGroups}
                onEdit={(item: any) => {
                  setEditGroup(true);
                  setNewGroup(true);
                  setSelectedGroup(item);
                  console.log(">>>> EditGroup :", editGroup);
                  console.log(">>>> NewGroup :", newGroup);
                }}
              />
            ))}

          <FlexboxGrid style={{ width: "fit-content", margin: "30px auto" }}>
            {groupNextToken != null ? (
              <IonButton
                fill="outline"
                className="outlineBtn btn-right btn-addGroup"
                onClick={() => handleFetchGroups(groupNextToken)}
                style={{ height: 30 }}
              >
                <IonIcon
                  icon={chevronDown}
                  style={{
                    verticalAlign: "middle",
                    color: "#777",
                    fontSize: 20,
                  }}
                  onClick={() => handleFetchGroups(groupNextToken)}
                />
              </IonButton>
            ) : !loading ? (
              "No More"
            ) : (
              ""
            )}
          </FlexboxGrid>
        </FlexboxGrid>

        <GroupSuccess
          open={groupSuccess}
          closee={() => {
            setGroupSuccess(!groupSuccess);
          }}
          memberCount={memberCount}
        />
      </FlexboxGrid>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  groups: state.groups.groups,
});
const mapDispatchToProps = {
  fetchGroups,
  groupRemoveData,
};
export default connect(mapStateToProps, mapDispatchToProps)(GroupPage);
