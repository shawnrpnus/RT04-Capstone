import React from "react";
import user1 from '../images/dashboard/user1.jpg';
import user3 from '../images/team/3.jpg';
import designer from '../images/dashboard/designer.jpg';
import boy2 from '../images/dashboard/boy-2.png';
import user from '../images/dashboard/user.png';
import team1 from '../images/team/1.jpg';
import d3 from '../images/dashboard/user3.jpg'
import team2 from '../images/team/2.jpg';
import user5 from '../images/dashboard/user5.jpg';
import user2 from '../images/dashboard/user2.jpg'

export const data = [
    {
        id: "1",
        vendor: <div><img src={user3} className="img-fluid img-40 rounded-circle blur-up lazyloaded mr-3" /><span>Anna Mull</span></div>,
        products: "1670",
        store_name: "Zotware",
        create_data: "8/10/18",
        w_balance: "$576132",
        revenue: "$9761266",
    },
    {
        id: "2",
        vendor: <div ><img src={designer} className="img-fluid img-40 rounded-circle blur-up lazyloaded mr-3" /><span>Colton Clay</span></div>,
        products: "9710",
        store_name: "Green-Plus",
        create_data: "6/5/18",
        w_balance: "$780250",
        revenue: "$8793611",
    },
    {
        id: "3",
        vendor: <div ><img src={boy2} className="img-fluid img-40 rounded-circle blur-up lazyloaded mr-3" /><span>Gray Brody</span></div>,
        products: "579",
        store_name: "Conecom",
        create_data: "25/2/18",
        w_balance: "$245508",
        revenue: "$1279520",
    },
    {
        id: "4",
        vendor: <div ><img src={user} className="img-fluid img-40 rounded-circle blur-up lazyloaded mr-3" /><span>Lane Skylar</span></div>,
        products: "8972",
        store_name: "Golddex",
        create_data: "30/3/18",
        w_balance: "$7812483",
        revenue: "$8761424",
    },
    {
        id: "5",
        vendor: <div ><img src={user1} className="img-fluid img-40 rounded-circle blur-up lazyloaded mr-3" /><span>Lane Skylar</span></div>,
        products: "8678",
        store_name: "Plexzap",
        create_data: "4/8/18",
        w_balance: "$89340",
        revenue: "$10285255",
    },
    {
        id: "6",
        vendor: <div ><img src={team1} className="img-fluid img-40 rounded-circle blur-up lazyloaded mr-3" /><span>Paige Turner</span></div>,
        products: "4680",
        store_name: "Finhigh",
        create_data: "11/7/18",
        w_balance: "$87616",
        revenue: "$947611",
    },
    {
        id: "7",
        vendor: <div ><img src={d3} className="img-fluid img-40 rounded-circle blur-up lazyloaded mr-3" /><span>Perez Alonzo</span></div>,
        products: "3476",
        store_name: "Betatech",
        create_data: "17/9/18",
        w_balance: "$32451",
        revenue: "$647212",
    },
    {
        id: "8",
        vendor: <div ><img src={team2} className="img-fluid img-40 rounded-circle blur-up lazyloaded mr-3" /><span>Petey Cruiser</span></div>,
        products: "1670",
        store_name: "Warephase",
        create_data: "8/10/18",
        w_balance: "$576132",
        revenue: "$9761266",
    },
    {
        id: "9",
        vendor: <div><img src={user5} className="img-fluid img-40 rounded-circle blur-up lazyloaded  mr-3" /><span>Rowan torres</span></div>,
        products: "790",
        store_name: "Sunnamplex",
        create_data: "5/6/18",
        w_balance: "$87610",
        revenue: "$631479",
    },
    {
        id: "10",
        vendor: <div><img src={user2} className="img-fluid img-40 rounded-circle blur-up lazyloaded  mr-3" /><span>Woters maxine</span></div>,
        products: "680",
        store_name: "Kan-code",
        create_data: "15/4/18",
        w_balance: "$27910",
        revenue: "$579214",
    },
]

export default data;