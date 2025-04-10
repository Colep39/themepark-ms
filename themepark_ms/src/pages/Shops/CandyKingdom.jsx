import './Shops.css';
import ShopItem from './ShopItem';
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function CandyKingdom(){
    const [items, setItems] = useState([]);

    const API_BASE_URL = 'https://themepark-backend-bcfpc8dvabedfcbt.centralus-01.azurewebsites.net/api/shop'; 

        useEffect(() => {
        fetchShop();
    }, []);

        const fetchShop = async () => {
            try {
                const response = await axios.get(API_BASE_URL);
                console.log("Fetched Shop data:", response.data);
        
                // Filter for only items that match this shop
                const filteredItems = response.data.filter(item => item.shop_name === "Candy_Kingdom");
                setItems(filteredItems);
                console.log(filteredItems);
        
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
    return(
        <>
            <div className="candy-container">
                <h1 id="shop-header">Candy Kingdom</h1>

                <div className="shop-items-container">

                    {items.map((item, index) => (
                        <ShopItem 
                            key={index}
                            src={item.item_img}
                            shopItemName={item.item_name}
                            price={item.item_price}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}