import  React,{ useEffect, useState,useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvent } from 'react-leaflet';
import { Marker,Popup,Tooltip } from 'react-leaflet';
import { create, list,remove } from './functions/newmap';
import './Stymap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import iconEdit from 'leaflet/dist/images/map-marker-icon_34392.png';
import {ZoomInOutlined, DeleteOutlined,EditOutlined } from '@ant-design/icons'
import { FloatButton, Avatar } from 'antd';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
let EditIcon = L.icon({
  iconUrl: iconEdit,
  shadowUrl: iconShadow,
  iconSize:[35,40],
  iconAnchor:[12.5,20.5]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
     
    const [position, setPosition] = useState(null);
    const [da, setDa] = useState ([])
    const [drag, setDrag] = useState(false);
    const [form, setForm] = useState({
      lat:0,
      lng:0
    });

    const [showTable, setShowTable] = useState(false);
    const [slideAnimation, setSlideAnimation] = useState(false);
    const [id,setId] = useState(null);

     //ฟังชั่นลูกเล่นอีเว้นโชว์ตารางเมื่อกด
    function toggleTable() {
      setShowTable(!showTable);
      setSlideAnimation(true);
    };

    useEffect(()=>{
         loadData()
  
      },[])
  
      const loadData =() => {
         list()
         .then((res) =>{
          setDa(res.data)
         })
         .catch((err) =>console.log(err));
         
      }

      const handleDragend = (e) =>{
        const newLat = e.target.getLatLng().lat;
        const newLng = e.target.getLatLng().lng;
        setForm({...form,
          lat:newLat,
          lng:newLng,
        });
        updateArrayData(id, newLat, newLng);
      };

      const updateArrayData = (id,lat,lng) =>{
        setDa((prevDa)=>
        prevDa.map((item) =>item._id === id
        ? {...item,lat,lng}
         : item )
        )
      };
    const handleOnChange =(e) =>{
          setForm({
            ...form,
            [e.target.name]: e.target.value,
          })
        }
       

       const mapRef = useRef(null)
       //ฟังค์ชั่นไปที่โดยใช้ลัดลองเเต่ปุ่มกดกับแผนที่ต้องอยู่หน้าเดียวกัน
       const flyto = (id,lat,lng)=>{
        setId(id)
         console.log(lat,lng)
         mapRef.current.flyTo([lat,lng],18)
       }

    const LocationMarker =() => {
        //  ดับเบิลคลิกเเล้วจะซูมเข้าไปโดยรับค่าลัดลอง เเละเก็บค่าเข้าไปในฟอร์ม
        const map = useMapEvent({
          dblclick (e) {
            // console.log(e.latlng);
            map.flyTo(e.latlng);
            setPosition(e.latlng);
  
            setForm({...form,
              lat:e.latlng.lat,
              lng:e.latlng.lng
            })
          },
        });
      //เเสดงหมุดตรงจุดลัดลองที่กดได้จากฟังชั่นด้านบน
      return position === null ? null : (
        <Marker position={position}>
  
        </Marker>
      );
      };

      const handleSubmit =(e) => {
         e.preventDefault();
        create(form)
        .then((res)=>{console.log(res); 
             loadData();
        })
        .catch((err) => console.log(err))
      }

      const handleRemove = (id)=>{
        console.log(id)
        if (window.confirm('เเน่ใจใช่มั้ยว่าจะลบ'))
        remove(id)
        .then((res)=>{
            console.log(res)
            loadData()
            // Swal.fire({
            //   icon: 'error',
            //   title: 'ลบ',
            //   text: 'ทำการลบสำเร็จ',
            // })
        }).catch((err)=>console.log(err))
      }
      const handleEdit =(id,lat,lng) => {
        flyto(id,lat,lng);
        // setId(id)
        // setDrag(true)
        // setEdit(true)
       };

  return (
    <div>
          <div className="row">
             <div className="col-md-10">
                          <MapContainer 
                           ref={mapRef}
                      style={{
                        // width: '100%', 
                      height: '100vh'}}
                      center={[17.538066792976007, 101.72001752686467]} 
                      zoom={17} 
                      scrollWheelZoom={false} 
                  >                
                  <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                       {/* จุดมาคเกอร์บนแผนที่มาแสดงพร้อมภาพป็อบอัพ */}
                      {da
                      ? da.map((item)=>
                      <Marker
                      eventHandlers={{click:()=> flyto(item._id,item.lat,item.lng),
                        dragend : (e) => handleDragend (e),
                        }} 
                        position={[item.lat,item.lng]}
                        draggable={id === item._id ? drag : false}
                        icon={id === item._id ? EditIcon : DefaultIcon}

                      >
                        <Popup>
                        <h3>{item.name}</h3> <br/> {item.detail} 
                        <br/><br/>
                        {/* <>ข้อมูลการเดินทางมายังจุด = </><a href={'https://maps.google.com/?q='+item.lat+","+item.lng}><button>หาเส้นทาง</button></a>  <br/> */}

                         {/* <br/> <img src={'http://localhost:5000/img/'+item.file}/>value */}
                          {/* <br/> {item.file} */}
                        </Popup>
                        <Tooltip>
                          <h6>{item.name}</h6>
                        </Tooltip>
                      </Marker>
                      ) 
                      : null}
       
                    <LocationMarker/>


                     <FloatButton onClick={toggleTable} className="float-button"/>
                     {/* เรียกใช้ฟังชั่นตารางเด้งออกมาเมื่อกดปุ่มด้านบน */}
                     <div
                            className={`content-table ${showTable ? "visible" : ""} ${
                              slideAnimation ? "slide-up" : ""
                            }`}
                          >
                             {/* ตารางข้อมูล          */}
                          {/* <div className="search-bar-container">
                            <input type="text" name='name'  className="form-control" onChange={(e) => setSearch(e.target.value)} placeholder='Search....' />
                          </div> */}

                          <table class="table">
                          <thead>
                          <tr>
                            <th scope="col">#</th>
                            {/* <th scope="col">ID</th> */}
                            <th scope="col">ลำดับ</th>
                            <th scope="col">ชื่อ</th>
                            <th scope="col">lat</th>
                            <th scope="col">lng</th>
                            <th scope="col">ไปที่</th>
                            {/* <th scope="col">แก้ไข</th> */}
                            <th scope="col">ลบ</th>
                          </tr>
                          </thead>
                          <tbody>
                          {da
                          // .filter((item) => {
                          //   return search.toLowerCase() === '' 
                          //   ? item
                          //   : item.name.toLowerCase().includes(search) || item.detail.toLowerCase().includes(search) ;
                          // })
                          .map((item) =>
                          <tr >
                            <th scope="row"></th>
                            <td>{item.name}</td>
                            <td>{item.detail}</td>
                            <td>{item.lat}</td>
                            <td>{item.lng}</td>
{/* 
                            <td>
                              <Avatar size={80} src={'http://localhost:5000/img/'+item.file}/>
                            </td> */}

                            <td><ZoomInOutlined
                            onClick={()=>flyto(item._id,item.lat,item.lng)}
                            style={{cursor: 'pointer'}}
                            /></td>
                            {/* <td>
                            <EditOutlined  onClick={()=>handleEdit(item._id,item.lat,item.lng)} style={{color:'red'}} />
                            </td> */}
                            <td>
                            <DeleteOutlined style={{color:'red'}} onClick={()=>handleRemove(item._id)}/>
                            </td>
                          </tr>
                          )}
                          </tbody>
                          </table>
                  </div>
                  </MapContainer>
             </div>
             <div className="col-md-2">
                          
    
                        <form  
                        // className='form-form' 
                        onSubmit={handleSubmit} enctype="multipart/form-data">
                                   เพิ่มข้อมูลอาคาร
                             {/* <div className="form-group"> */}
                              {/* <label>ID*</label>
                              <input onChange={(e) => handleOnChange(e)} className="form-control" type="text" name="id"    variant="outlined" required/>
                              </div> */}
                              <div className="form-group">
                              <label>จุด*</label>
                              <input onChange={(e) => handleOnChange(e)} className="form-control" type="text" name="name"  variant="outlined" required/>
                              </div>
                              <div className="tebel">
                              <label>ชื่อ</label>
                              <input    onChange={(e) => handleOnChange(e)} className="form-control" type="text" name="detail" />
                              </div>  
                              <div className="form-group">
                              <label>latitude*</label>
                              <input  value={form.lat} onChange={(e) => handleOnChange(e)}   className="form-control" type="text" name="lat"  variant="outlined" required/>
                              </div>  
                              <div className="form-group">
                              <label>longitude*</label>
                              <input  value={form.lng} onChange={(e) => handleOnChange(e)}  className="form-control" type="text" name="lng"  variant="outlined" required/>
                              </div>
                              {/* <div className="form-group">
                              <label>รูปภาพ</label>
                              <input   
                              onChange={(e) => handleOnChange(e)}  
                              className="form-control" 
                              type="file" 
                              name="file"/>
                              </div> <br></br> */}
                   
                              <button  className='btn btn-primary' type='submit' >บันทึก</button>
     
                          
                          </form>
                   </div>
        </div>


                   
    </div>
  )
}

export default Map