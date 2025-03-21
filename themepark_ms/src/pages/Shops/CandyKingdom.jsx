import './Shops.css';
import ShopItem from './ShopItem';

export default function CandyKingdom(){
    return(
        <>
            <div className="candy-container">
                <h1 id="shop-header">Candy Kingdom</h1>

                <div className="shop-items-container">
                    <ShopItem src="src/images/cool-mint-crunch.webp" shopItemName="Cool Mint Crunch" price="5.00"/>
                    <ShopItem src="src/images/cotton-candy-ice.jpg" shopItemName="Cotton Candy Ice Cream" price="5.00"/>
                    <ShopItem src="src/images/cookies-n-cream.webp" shopItemName="Cookies N Cream" price="5.00"/>
                    <ShopItem src="src/images/pretzel.webp" shopItemName="Pretzel" price="3.50"/>
                    <ShopItem src="src/images/cotton-candy.webp" shopItemName="Cotton Candy" price="7.00" />
                    <ShopItem src="src/images/cookies.webp" shopItemName="Cookies (4)" price="8.00"/>
                    <ShopItem src="src/images/churros.jpg" shopItemName="Churros" price="6.00"/>
                    <ShopItem src="src/images/candy-apple.jpg" shopItemName="Candy Apple" price="2.50"/>
                </div>
            </div>
        </>
    )
}