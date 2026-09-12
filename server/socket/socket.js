const setUpSocket=(io)=>{
    io.on("connection", (socket) => {
      socket.on("join-group",({groupId})=>{
        socket.join(groupId)
      })
    })
}
export default setUpSocket