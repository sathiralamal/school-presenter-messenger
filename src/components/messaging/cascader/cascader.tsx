import { useEffect, useState } from "react";
import { Icon, Input, InputGroup, MultiCascader } from "rsuite";
import './cascader.css'
import useGetCacheTenantId from "../../../hooks/useGetCacheTenantId";

// import CascadeData from "./data";
import * as integration from "scholarpresent-integration";
var cascadeRawData: any = []

const CasCaderComponent = (props: any) => {

    const [levelTitle, setLevelTitle] = useState<string>('')
    const [parentTitle, setParentTitle] = useState<string[]>([])
    const [updater, setUpdater] = useState<string>('0')
    const [activeIndex, setActiveIndex] = useState<number>(-1)
    const [replyNotificationView, setReplyNotificationView] = useState<boolean>(false)
    const [cascadeData, setCascadeData] = useState<any[]>([])
	let tenantId:string = useGetCacheTenantId();

    useEffect(() => {
        setLevelTitle(parentTitle[parentTitle.length - 1])
    }, [parentTitle.length])

    useEffect(() => {
        integration.getUserRoles().then(async (_roles: any) => {
              let roles = JSON.parse(_roles);
            formatData(roles.items)
        })
        // integration.listAllGroups().then(async (res: any) => {
        //     console.log('listAllGroups', res)
        // })
    }, [])

    const formatData = async (data: any[]) => {
        cascadeRawData = data
        await data.forEach(async (item: any, index: number) => await getChildren(item, index))
        setCascadeData(cascadeRawData)
        setUpdater(Math.random().toString())
    }

    const getChildren = (event: any, index: number) => {
        switch (event.roleName) {
            case 'Student':
                getGrades(event.roleName, index)
                break;
            case 'Teacher':
                getGrades(event.roleName, index)
                break;
            case 'Principal':
                console.log('Principal', event)
                break;
            default:
                console.log('Something went wrong! ' + event.roleName)
                break;
        }
    }
    
    
    const handleSelect = (event: any) => {

    }

    const getGrades = (role: string, index: number) => {
        integration.getGrades(undefined).then(async (res: any) => {
            cascadeRawData[index].children = res?.items
            cascadeRawData[index].children.forEach((g: any, gradeIndex: number) => {
                g.roleName = g.gradeName
                listClassNamesByGradeIdInfo(g, gradeIndex, index, role)
            })
            setUpdater(Math.random().toString())
        })
    }
    const listClassNamesByGradeIdInfo = (grade: any, gradeIndex: number, roleIndex: number, role: any) => {

        integration.listClassNamesByGradeIdInfo(grade.id, null).then(async (res: any) => {
            if (res?.items) {
                cascadeRawData[roleIndex].children[gradeIndex].children = res?.items
                setCascadeData(cascadeRawData)
                setUpdater(Math.random().toString())
                await res?.items.forEach((g: any, classIndex: number) => {
                    g.roleName = g.className
                    getClassDetails(role, g, roleIndex, gradeIndex, classIndex)
                })
            }
        })
    }

    const getClassDetails = (role: any, gradeData: any, roleIndex: number, gradeIndex: number, classIndex: number) => {

        integration.listClassNamesByGradeIdInfo(gradeData.id, null).then((res: any) => {
            if (res?.items) {
                res?.items.forEach(((g: any) => g.roleName = g.className))
                cascadeRawData[roleIndex].children[gradeIndex].children[classIndex].children = res?.items
                setCascadeData(cascadeRawData)
                setUpdater(Math.random().toString())

            }
        })
    }


    const changeCascaderLevel = (event: any) => {
        if (event?.children?.length > 0) {
            let childLength = document.querySelector('.new-message-btn div')?.children?.length || 0
            let div: any = document.querySelector('.new-message-btn div')
            div.children[childLength - 1].style.width = '156px';
            if (div.children[childLength - 2]) {
                div.children[childLength - 2].style.width = '0px';
                let parent: string[] = parentTitle
                parent.push(event.roleName)
                // @ts-ignore
                let parentSet = [...new Set(parent)]
                setParentTitle(parentSet)
            }
        }
    }

    return (
        <div className='multiCascader new-message' key={updater}>
            <MultiCascader labelKey='roleName' childrenKey='children' 
            onSelect={(event) => { changeCascaderLevel(event) }} 
            onSeach={(event:any) => { console.log("onSeach event ", event) }} 
            
            renderExtraFooter={() => <CaseCaderFooter conversationName={props.conversationName} 
            createGroupHandler={props.createGroupHandler} setConversationName={props.setConversationName} 
            setParentTitle={setParentTitle} 
            parentTitle={parentTitle} 
            title={levelTitle} 
            setLevelTitle={setLevelTitle} />} 
            className='new-message-btn remove-cascade-arrow' placeholder="+ New Message" valueKey='id' data={cascadeData} />
        </div>
    )
}

export default CasCaderComponent;

const CaseCaderFooter = (props: any) => {

    const removeLastLevel = () => {
        // debugger
        let childLength = document.querySelector('.new-message-btn div')?.children?.length || 0
        let div: any = document.querySelector('.new-message-btn div')
        let parent: string[] = props.parentTitle
        parent.pop()
        props.setParentTitle(parent)
        props.setLevelTitle(parent[parent.length - 1])
        if(div?.childNodes?.length){
            div.childNodes.forEach((node:any,index:number)=>{
                if(index==parent.length){
                    div.childNodes[index].style.width = '156px';
                }else{
                    div.childNodes[index].style.width = '0';
                }
            })
        }
    }

    return (
        <>
            <div className='multiCascader-back-btn'>
                {
                    props?.parentTitle?.length ?
                        <div onClick={() => removeLastLevel()}>
                            <Icon icon='chevron-left' />
                            <span>{props.title}</span>
                        </div> : null
                }
            </div>
            <InputGroup inside color="green">
                <Input placeholder='Name' value={props.conversationName} onChange={(value) => props.setConversationName(value)} />
                <InputGroup.Button onClick={() => props.createGroupHandler()} color="green">
                    <Icon icon="plus" />
                </InputGroup.Button>
            </InputGroup>
        </>
    )
}