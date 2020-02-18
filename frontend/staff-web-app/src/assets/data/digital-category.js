import React from 'react';
import design from '../images/digital-product/graphic-design.png';
import ebooks from '../images/digital-product/ebooks.png';
import video from '../images/digital-product/lecture-video-recorder.jpg';
import application from '../images/digital-product/application.jpg';
import wevdev from '../images/digital-product/web-dev.jpg';

const data = [
    {
        image: <img src={design} style={{width:50,height:50}}/>,
        product_name: "Graphic Design",
        price: "$57.00",
        status: <i className="fa fa-circle font-success f-12"/>,
        category: "Digital"
    },
      {
        image: <img src={ebooks} style={{width:50,height:50}} />,
        product_name: "ebooks",
        price: "$472.00",
        status: <i className="fa fa-circle font-warning f-12"/>,
        category: "Digital"
    },
    {
        image: <img src={video} style={{width:50,height:50}} />,
        product_name: "Recorded lectures",
        price: "$54.00",
        status: <i className="fa fa-circle font-success f-12"/>,
        category: "Digital"
    },
    {
        image: <img src={application} style={{width:50,height:50}} />,
        product_name: "Application",
        price: "$525.00",
        status: <i className="fa fa-circle font-danger f-12"/>,
        category: "Digital"
    },
    {
        image: <img src={wevdev} style={{width:50,height:50}} />,
        product_name: "Websites",
        price: "$5782.00",
        status:<i className="fa fa-circle font-warning f-12"/> ,
        category: "Digital"
    },
]

export default data;