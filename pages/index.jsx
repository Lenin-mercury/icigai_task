import { useState, useEffect } from "react"
import { useUser } from "@auth0/nextjs-auth0"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { v4 as uuid } from "uuid"
import { userService } from "services"
import itemsFromDB from "../data/users.json"

export default Home

function Home() {
  //user auth
  const { user } = useUser()
  if (!user) {
    return (
      <div>
        <h1>Login to continue</h1>
      </div>
    )
  }

//   display all public arrays here
  const publicArray = []
  itemsFromDB.map((items)=>{
    items.publicItems.map((pitems)=>{
      publicArray.push(pitems);
    })
  })
  const [currentUser, setCurrentUser] = useState(
    itemsFromDB.find((x) => x.email === user.email)
  )

  const columnsFromBackend = {
    [uuid()]: {
      name: "Public",
      //public items should go here all files in itemsfromDB
      items: publicArray,
    },
    [uuid()]: {
      name: "Private",
      items: currentUser === null ? [] : currentUser.privateItems,
    },
  }
  const [columns, setColumns] = useState(columnsFromBackend)

  const [pubtoggle, setPubToggle] = useState(false)

  useEffect(() => {
    userService.getAll().then((data) => {
      const foundUser = data.find((x) => x.email === user.email)
      setCurrentUser(foundUser)
      setColumns(columnsFromBackend)
      return foundUser
    })
  }, [pubtoggle])
  const [formData, setFormdata] = useState({
    publicValue: "",
    privateValue: "",
  })

  const onhandleChange = (e) =>
    setFormdata({ ...formData, [e.target.name]: e.target.value })

  const { publicValue, privateValue } = formData

  const onPrivateCreate = (e) => {
    e.preventDefault()
    const body = {
      value: privateValue,
      email: user.email,
      isprivate: true,
    }
    userService.updateItems(currentUser.id, body)
    setFormdata({
      publicValue: "",
      privateValue: "",
    })
  }
  const onPublicCreate = (e) => {
    e.preventDefault()
    const body = {
      value: publicValue,
      email: user.email,
      isprivate: false,
    }
    userService.updateItems(currentUser.id, body)
    setFormdata({
      publicValue: "",
      privateValue: "",
    })
  }

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]

      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)

      //public to private
      if(sourceColumn.name === "Public"){
        const sourceValue = sourceColumn.items[source.index]
        // this body will store in private
        const body={
          itemsid:sourceValue.id,
          value:sourceValue.value,
          email:currentUser.email,
          isprivate:true
        }
        userService.updateItems(currentUser.id,body)
        setPubToggle(!pubtoggle)
        //private to public
      } else if(sourceColumn.name === "Private") {
        const sourceValue = sourceColumn.items[source.index];
        // this body will store in public
        const body={
          itemsid:sourceValue.id,
          value:sourceValue.value,
          email:currentUser.email,
          isprivate:false
        }
        userService.updateItems(currentUser.id,body)
        setPubToggle(!pubtoggle)
      }
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })
    } else {
      const column = columns[source.droppableId]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
  }
  return (
    <div>
      <h1 className="home-header">Welcome <span style={{color:"#B8405E"}}> {user.email} </span>  !!!</h1>
      <section>
        <div className="home-container">
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div
                className="home-content-container"
                  // style={{
                  //   display: "flex",
                  //   flexDirection: "column",
                  //   alignItems: "center",
                  // }}
                  key={columnId}
                >
                  <h3>{column.name}</h3>
                  {(column.name === "Public" && (
                    <>
                      <form onSubmit={onPublicCreate} className="home-form">
                        <input
                          type="text"
                          onChange={(e) => onhandleChange(e)}
                          value={publicValue}
                          name="publicValue"
                          className="home-input"
                        />
                        <button
                          className="btn btn-dark home-button"
                          onClick={() => setPubToggle(!pubtoggle)}
                        >
                          Add To Public
                        </button>
                      </form>
                    </>
                  )) ||
                    (column.name === "Private" && (
                      <>
                        <form onSubmit={onPrivateCreate} className="home-form">
                          <input
                            type="text"
                            onChange={(e) => onhandleChange(e)}
                            value={privateValue}
                            name="privateValue"
                            className="home-input"
                          />
                          <button
                            className="btn btn-dark home-button"
                            onClick={() => setPubToggle(!pubtoggle)}
                          >
                            Add To Private
                          </button>
                        </form>
                      </>
                    ))}
                  <div style={{margin:"10px"}}>
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="home-droppable"
                            style={{
                              background: snapshot.isDraggingOver
                                ? "lightblue"
                                : "lightgrey"
                            }}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                      className="home-draggable"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          userSelect: "none",
                                          backgroundColor: snapshot.isDragging
                                            ? "#263B4A"
                                            : "#456C86",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        {item.value}
                                      </div>
                                    )
                                  }}
                                </Draggable>
                              )
                            })}
                            {provided.placeholder}
                          </div>
                        )
                      }}
                    </Droppable>
                  </div>
                </div>
              )
            })}
          </DragDropContext>
        </div>
      </section>
    </div>
  )
}
