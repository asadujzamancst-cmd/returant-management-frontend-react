import React,{useState} from "react";
import {Link} from "react-router-dom";

const FloatingChat=()=>{

const [open,setOpen]=useState(false);

return(

<>

<div
onClick={()=>setOpen(!open)}
style={{
position:"fixed",
bottom:"110px",
right:"32px",
background:"#0d6efd",
color:"white",
width:"60px",
height:"60px",
borderRadius:"50%",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontSize:"25px",
cursor:"pointer",
zIndex:9999
}}
>

💬

</div>


{open &&(

<div style={{
position:"fixed",
bottom:"120px",
right:"95px",
width:"250px",
background:"white",
padding:"10px",
borderRadius:"10px",
boxShadow:"0px 0px 10px gray"
}}>

<Link
to="/chat"
className="btn btn-primary w-100"
>

Open Chat

</Link>

</div>

)}

</>

)

}

export default FloatingChat;