from app.db.session import SessionLocal, engine
from app.db.models import Base, Outlet, MenuItem, User, UserRole

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data
    db.query(MenuItem).delete()
    db.query(Outlet).delete()
    db.query(User).delete()

    # ----------------------------------------------------
    # 1. OUTLETS SETUP
    # ----------------------------------------------------
    just_chill = Outlet(
        name="Just Chill Cafe",
        is_open=True,
        estimated_wait_time=15,
        image_url="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
    )
    go_insta = Outlet(
        name="Go Insta Cafe",
        is_open=True,
        estimated_wait_time=10,
        image_url="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb"
    )
    mahaveer = Outlet(
        name="Mahaveer Juice & Shakes",
        is_open=True,
        estimated_wait_time=8,
        image_url="https://images.unsplash.com/photo-1553530666-ba11a7da3888"
    )
    nescafe = Outlet(
        name="Nescafe Hostel",
        is_open=True,
        estimated_wait_time=12,
        image_url="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
    )
    tea_post = Outlet(
        name="Tea Post",
        is_open=True,
        estimated_wait_time=7,
        image_url="https://images.unsplash.com/photo-1544787219-7f47ccb76574"
    )

    db.add_all([just_chill, go_insta, mahaveer, nescafe, tea_post])
    db.commit()

    # Helper function to create items safety-checking optional model attributes
    def create_item(outlet_id, name, price, category="General", is_available=True, rating=4.5, likes_count=0, is_bestseller=False):
        kwargs = {
            "outlet_id": outlet_id,
            "name": name,
            "price": float(price),
            "is_available": is_available
        }
        if hasattr(MenuItem, 'category'): kwargs['category'] = category
        if hasattr(MenuItem, 'rating'): kwargs['rating'] = rating
        if hasattr(MenuItem, 'likes_count'): kwargs['likes_count'] = likes_count
        if hasattr(MenuItem, 'is_bestseller'): kwargs['is_bestseller'] = is_bestseller
        return MenuItem(**kwargs)

    # ----------------------------------------------------
    # 2. ALL MENU ITEMS FROM PDFS
    # ----------------------------------------------------
    items = [
        # ====================================================
        # OUTLET 1: JUST CHILL CAFE
        # ====================================================
        # Chinese Veg
        create_item(just_chill.id, "Veg Fried Rice", 80, "Chinese Veg"),
        create_item(just_chill.id, "Manchurian Rice", 80, "Chinese Veg"),
        create_item(just_chill.id, "Schezwan Rice", 80, "Chinese Veg"),
        create_item(just_chill.id, "Manch-Schez Rice", 90, "Chinese Veg"),
        create_item(just_chill.id, "Paneer Fried Rice", 90, "Chinese Veg"),
        create_item(just_chill.id, "Veg Hakka Noodles", 80, "Chinese Veg", True, 4.6, 120, True),
        create_item(just_chill.id, "Manchurian Noodles", 80, "Chinese Veg"),
        create_item(just_chill.id, "Schezwan Noodles", 80, "Chinese Veg"),
        create_item(just_chill.id, "Paneer Hakka Noodles", 90, "Chinese Veg"),

        # Chinese Non-Veg
        create_item(just_chill.id, "Egg Fried Rice", 80, "Chinese Non-Veg"),
        create_item(just_chill.id, "Egg Noodles", 80, "Chinese Non-Veg"),
        create_item(just_chill.id, "Chicken Fried Rice", 90, "Chinese Non-Veg", True, 4.7, 140, True),
        create_item(just_chill.id, "Chicken Schezwan Rice", 90, "Chinese Non-Veg"),
        create_item(just_chill.id, "Chicken Combination Rice", 90, "Chinese Non-Veg"),
        create_item(just_chill.id, "Chicken Noodles", 90, "Chinese Non-Veg"),
        create_item(just_chill.id, "Chicken Schezwan Noodles", 90, "Chinese Non-Veg"),

        # Starters & Egg Items
        create_item(just_chill.id, "Veg Manchurian (Gravy/Dry)", 80, "Starters"),
        create_item(just_chill.id, "Paneer Chilli", 160, "Starters", True, 4.8, 180, True),
        create_item(just_chill.id, "Chicken Dana", 100, "Starters"),
        create_item(just_chill.id, "Chicken Chilly", 150, "Starters"),
        create_item(just_chill.id, "Omelette + 2 Bread", 55, "Egg Items"),
        create_item(just_chill.id, "Half-Fry + 2 Bread", 55, "Egg Items"),
        create_item(just_chill.id, "Egg Bhurji + 2 Bread", 55, "Egg Items"),

        # Momos
        create_item(just_chill.id, "Classic Veg Momos", 80, "Momos"),
        create_item(just_chill.id, "Paneer Steam Momos", 90, "Momos"),
        create_item(just_chill.id, "Paneer Pan Fried Momos", 110, "Momos", True, 4.8, 210, True),
        create_item(just_chill.id, "Corn Cheese Momos", 110, "Momos"),
        create_item(just_chill.id, "Chicken Steam Momos", 90, "Momos"),
        create_item(just_chill.id, "Chicken Pan Fried Momos", 110, "Momos", True, 4.7, 190, True),
        create_item(just_chill.id, "Spicy Mutton Momos", 110, "Momos"),

        # Paratha & Rice
        create_item(just_chill.id, "Aloo Paratha", 60, "Paratha"),
        create_item(just_chill.id, "Aloo-Paneer Mix Paratha", 70, "Paratha"),
        create_item(just_chill.id, "Special Paneer Paratha", 90, "Paratha"),
        create_item(just_chill.id, "Plain Rice", 60, "Rice"),
        create_item(just_chill.id, "Jeera Rice", 70, "Rice"),
        create_item(just_chill.id, "Chapati", 15, "Sides"),
        create_item(just_chill.id, "Elaichi Chai", 15, "Beverages"),

        # ====================================================
        # OUTLET 2: GO INSTA CAFE
        # ====================================================
        # Cold Coffee & Shakes
        create_item(go_insta.id, "Hazelnut Cold Coffee (225ml)", 60, "Cold Coffee", True, 4.9, 320, True),
        create_item(go_insta.id, "Cappuccino Cold Coffee (225ml)", 60, "Cold Coffee"),
        create_item(go_insta.id, "Brazilian Roast Cold Coffee (225ml)", 60, "Cold Coffee"),
        create_item(go_insta.id, "Classic French Roast Cold Coffee (225ml)", 50, "Cold Coffee"),
        create_item(go_insta.id, "Mocha Cold Coffee (225ml)", 50, "Cold Coffee"),
        create_item(go_insta.id, "Americano Water Base (225ml)", 40, "Cold Coffee"),
        create_item(go_insta.id, "Vanilla Coffee Shake (225ml)", 60, "Coffee Shakes"),
        create_item(go_insta.id, "Chocolate Coffee Shake (225ml)", 60, "Coffee Shakes"),
        create_item(go_insta.id, "Oreo Coffee Shake (225ml)", 60, "Coffee Shakes", True, 4.7, 150, True),

        # Hot Coffee & Drinks
        create_item(go_insta.id, "Hot Mocha (100ml)", 30, "Hot Coffee"),
        create_item(go_insta.id, "Hot Hazelnut (100ml)", 35, "Hot Coffee"),
        create_item(go_insta.id, "Hot Cappuccino (100ml)", 30, "Hot Coffee"),
        create_item(go_insta.id, "Hot Brazilian Roast (100ml)", 35, "Hot Coffee"),
        create_item(go_insta.id, "Hot Classic French Roast (100ml)", 30, "Hot Coffee"),
        create_item(go_insta.id, "Adrak Chai Cutting", 15, "Hot Drinks"),
        create_item(go_insta.id, "Adrak Chai Mug", 30, "Hot Drinks"),
        create_item(go_insta.id, "Hot Chocolate", 60, "Hot Drinks"),
        create_item(go_insta.id, "Caramel Hot Chocolate", 65, "Hot Drinks"),

        # Ice Tea, Slush & Lemonade
        create_item(go_insta.id, "Lemon Ice Tea (225ml)", 40, "Ice Tea"),
        create_item(go_insta.id, "Lemon Mint Ice Tea (225ml)", 45, "Ice Tea"),
        create_item(go_insta.id, "Peach Ice Tea (225ml)", 40, "Ice Tea"),
        create_item(go_insta.id, "Lychee Ice Tea (225ml)", 40, "Ice Tea"),
        create_item(go_insta.id, "Blueberry Ice Tea (225ml)", 40, "Ice Tea"),
        create_item(go_insta.id, "Mint Crush Slush", 40, "Slush"),
        create_item(go_insta.id, "Blueberry Slush", 40, "Slush"),
        create_item(go_insta.id, "Peach Lemonade", 30, "Lemonade"),
        create_item(go_insta.id, "Ginger Lemonade", 25, "Lemonade"),

        # Food Items
        create_item(go_insta.id, "Veg Masala Oats", 60, "Health Noodles"),
        create_item(go_insta.id, "Masala Atta Noodles", 60, "Health Noodles"),
        create_item(go_insta.id, "Veg Atta Noodles", 65, "Health Noodles"),
        create_item(go_insta.id, "Spicy Corn Sandwich", 75, "Sandwiches"),
        create_item(go_insta.id, "Mexican Sandwich", 70, "Sandwiches"),
        create_item(go_insta.id, "Tandoori Paneer Sandwich", 90, "Sandwiches"),
        create_item(go_insta.id, "Peri Peri Paneer Sandwich", 90, "Sandwiches"),
        create_item(go_insta.id, "Paneer Makhni Sandwich", 100, "Sandwiches"),
        create_item(go_insta.id, "Veg Sandwich (Not Grilled)", 50, "Sandwiches"),
        create_item(go_insta.id, "Grilled Veg Sandwich", 60, "Sandwiches"),
        create_item(go_insta.id, "Veg Cheese Sandwich", 75, "Sandwiches"),
        create_item(go_insta.id, "Cheese Corn Sandwich", 70, "Sandwiches"),

        # Toasts & Garlic Breads
        create_item(go_insta.id, "Cheese Makhni Paneer Toast", 100, "Jumbo Paneer Toasts"),
        create_item(go_insta.id, "Peri Peri Cheese Paneer Toast", 100, "Jumbo Paneer Toasts", True, 4.8, 210, True),
        create_item(go_insta.id, "Tandoori Cheese Paneer Toast", 100, "Jumbo Paneer Toasts"),
        create_item(go_insta.id, "Cheese Salsa Paneer Toast", 100, "Jumbo Paneer Toasts"),
        create_item(go_insta.id, "Mexican Cheese Paneer Toast", 110, "Jumbo Paneer Toasts"),
        create_item(go_insta.id, "Cheese Mayo Paneer Toast", 90, "Jumbo Paneer Toasts"),
        create_item(go_insta.id, "French Fries (125g)", 50, "Fries"),
        create_item(go_insta.id, "Masala Fries (125g)", 60, "Fries"),
        create_item(go_insta.id, "Peri Peri Fries (165g)", 75, "Fries"),
        create_item(go_insta.id, "Garlic Bread (3 pcs)", 50, "Garlic Bread"),
        create_item(go_insta.id, "Corn Capsicum Cheese Garlic Bread", 75, "Garlic Bread"),
        create_item(go_insta.id, "Veg Bonanza Cheese Garlic Bread", 75, "Garlic Bread"),

        # ====================================================
        # OUTLET 3: MAHAVEER JUICE & SHAKES
        # ====================================================
        # Milkshakes
        create_item(mahaveer.id, "Banana Shake", 30, "Milk Shake"),
        create_item(mahaveer.id, "Banana Choco Shake", 40, "Milk Shake"),
        create_item(mahaveer.id, "Apple Shake", 40, "Milk Shake"),
        create_item(mahaveer.id, "Chocolate Shake", 40, "Milk Shake"),
        create_item(mahaveer.id, "Oreo Shake", 40, "Milk Shake"),
        create_item(mahaveer.id, "Oreo Chocolate Shake", 50, "Milk Shake"),
        create_item(mahaveer.id, "Oreo Coffee Shake", 50, "Milk Shake"),
        create_item(mahaveer.id, "Chiku Shake", 45, "Milk Shake"),
        create_item(mahaveer.id, "Chiku Choco Shake", 50, "Milk Shake"),
        create_item(mahaveer.id, "Choco Muffin Shake", 45, "Milk Shake"),
        create_item(mahaveer.id, "Choco Munch Shake", 45, "Milk Shake"),
        create_item(mahaveer.id, "Kit Kat Shake", 55, "Milk Shake", True, 4.9, 290, True),
        create_item(mahaveer.id, "Simple Mango Shake", 45, "Milk Shake"),
        create_item(mahaveer.id, "Rapchik Mango Shake", 50, "Milk Shake"),
        create_item(mahaveer.id, "Cold Coffee", 40, "Milk Shake"),
        create_item(mahaveer.id, "Choco Coffee", 40, "Milk Shake"),
        create_item(mahaveer.id, "Pineapple Shake", 40, "Milk Shake"),
        create_item(mahaveer.id, "Blueberry Shake", 45, "Milk Shake"),

        # Fresh Juices
        create_item(mahaveer.id, "Orange Juice", 45, "Fresh Juice"),
        create_item(mahaveer.id, "Mousami Juice", 45, "Fresh Juice"),
        create_item(mahaveer.id, "Pineapple Juice", 40, "Fresh Juice"),
        create_item(mahaveer.id, "Apple Juice", 45, "Fresh Juice"),
        create_item(mahaveer.id, "Anar (Pomegranate) Juice", 60, "Fresh Juice"),
        create_item(mahaveer.id, "Watermelon Juice", 35, "Fresh Juice"),
        create_item(mahaveer.id, "Mix Fruit Juice", 40, "Fresh Juice"),
        create_item(mahaveer.id, "Ganga Jamuna Juice", 45, "Fresh Juice"),
        create_item(mahaveer.id, "Strawberry Juice", 45, "Fresh Juice"),
        create_item(mahaveer.id, "Pure Mango Juice", 50, "Fresh Juice"),

        # Lassi & Veg Juices
        create_item(mahaveer.id, "Simple Lassi", 30, "Lassi"),
        create_item(mahaveer.id, "Fruit Lassi", 45, "Lassi"),
        create_item(mahaveer.id, "Dryfruits Lassi", 50, "Lassi"),
        create_item(mahaveer.id, "Chocolate Lassi", 45, "Lassi"),
        create_item(mahaveer.id, "Rose Lassi", 45, "Lassi"),
        create_item(mahaveer.id, "Rajwadi Lassi", 55, "Lassi", True, 4.9, 310, True),
        create_item(mahaveer.id, "Mango Lassi", 40, "Lassi"),
        create_item(mahaveer.id, "Carrot Juice", 30, "Vegetable Juice"),
        create_item(mahaveer.id, "Beet Root Juice", 35, "Vegetable Juice"),
        create_item(mahaveer.id, "Mix Veg Juice", 35, "Vegetable Juice"),

        # Sundae & Refreshing
        create_item(mahaveer.id, "Lemon Juice", 15, "Refreshing"),
        create_item(mahaveer.id, "Lemon Soda", 20, "Refreshing"),
        create_item(mahaveer.id, "Pudina Soda", 20, "Refreshing"),
        create_item(mahaveer.id, "Vanilla Sundae", 40, "Ice-Cream Sundae"),
        create_item(mahaveer.id, "Butter Scotch Sundae", 55, "Ice-Cream Sundae"),
        create_item(mahaveer.id, "Chocolate Sundae", 55, "Ice-Cream Sundae"),
        create_item(mahaveer.id, "American Nuts Sundae", 60, "Ice-Cream Sundae"),
        create_item(mahaveer.id, "Mahaveer Special Sundae", 80, "Ice-Cream Sundae", True, 4.8, 180, True),

        # ====================================================
        # OUTLET 4: NESCAFE HOSTEL
        # ====================================================
        create_item(nescafe.id, "Bread Butter", 35, "Buns"),
        create_item(nescafe.id, "Maska Bun", 40, "Buns"),
        create_item(nescafe.id, "Maska Bun With Jam", 45, "Buns"),
        create_item(nescafe.id, "Cheese Chutney Sandwich", 45, "Sandwiches"),
        create_item(nescafe.id, "Fresh Vegetable Sandwich", 90, "Sandwiches"),
        create_item(nescafe.id, "Tandoori Sandwich", 90, "Sandwiches"),
        create_item(nescafe.id, "Makhani Sandwich", 90, "Sandwiches"),
        create_item(nescafe.id, "Cheese Grilled Sandwich", 90, "Sandwiches"),
        create_item(nescafe.id, "Bombay Sandwich", 100, "Sandwiches"),
        create_item(nescafe.id, "Peri Peri Spicy Sandwich", 110, "Sandwiches"),
        create_item(nescafe.id, "Paneer Tikka Sandwich", 110, "Sandwiches", True, 4.7, 190, True),
        create_item(nescafe.id, "Jumbo Sandwich", 120, "Sandwiches"),
        create_item(nescafe.id, "Avocado Sandwich", 120, "Sandwiches"),
        create_item(nescafe.id, "Cheese Garlic Bread", 80, "Garlic Bread"),
        create_item(nescafe.id, "Supreme Garlic Bread", 90, "Garlic Bread"),
        create_item(nescafe.id, "Veggie Fingers", 70, "Quick Bites"),
        create_item(nescafe.id, "Chilli Garlic Potato Bites", 70, "Quick Bites"),
        create_item(nescafe.id, "Potato Cheese Shotz", 80, "Quick Bites"),
        create_item(nescafe.id, "Masala-ae-magic French Fries", 70, "Fries"),
        create_item(nescafe.id, "Cheesy French Fries", 90, "Fries"),
        create_item(nescafe.id, "Herb Chilli Burger", 60, "Burgers"),
        create_item(nescafe.id, "Superveg Burger", 70, "Burgers"),
        create_item(nescafe.id, "Spicy Paneer Burger", 90, "Burgers"),
        create_item(nescafe.id, "Mint Paneer Burger", 90, "Burgers"),
        create_item(nescafe.id, "Veg Wrap", 90, "Wraps"),
        create_item(nescafe.id, "Spicy Paneer Wrap", 120, "Wraps"),
        create_item(nescafe.id, "Mint Paneer Wrap", 120, "Wraps"),
        create_item(nescafe.id, "Spicy Butter Masala Omelette", 80, "Egg Items"),
        create_item(nescafe.id, "Egg Sandwich", 90, "Egg Items"),
        create_item(nescafe.id, "Chicken Finger", 80, "Non-Veg Quick Bites"),
        create_item(nescafe.id, "Chicken Nuggets", 90, "Non-Veg Quick Bites"),
        create_item(nescafe.id, "Chicken Tender", 90, "Non-Veg Quick Bites"),
        create_item(nescafe.id, "Chicken Burger", 90, "Non-Veg Burgers"),
        create_item(nescafe.id, "Hot & Spicy Chicken Burger", 120, "Non-Veg Burgers", True, 4.8, 240, True),
        create_item(nescafe.id, "Chicken Wrap", 120, "Non-Veg Wraps"),
        create_item(nescafe.id, "Hot & Spicy Chicken Wrap", 140, "Non-Veg Wraps", True, 4.7, 180, True),

        # ====================================================
        # OUTLET 5: TEA POST
        # ====================================================
        create_item(tea_post.id, "Poha (125gm)", 25, "Nasta", True, 4.6, 210, True),
        create_item(tea_post.id, "Upma (200gm)", 35, "Nasta"),
        create_item(tea_post.id, "Thepla (3 Pcs with pickle)", 30, "Nasta"),
        create_item(tea_post.id, "Khichu (250gm)", 53, "Nasta"),
        create_item(tea_post.id, "Maskabun (110gm)", 30, "Nasta"),
        create_item(tea_post.id, "Jam Bun (110gm)", 35, "Nasta"),
        create_item(tea_post.id, "Spicy Bun Grilled (110gm)", 45, "Nasta"),
        create_item(tea_post.id, "Veggie Finger (5 Pcs)", 74, "Nasta"),
        create_item(tea_post.id, "Cheese Garlic Bread (3 Pcs)", 74, "Nasta"),
        create_item(tea_post.id, "French Fries (120gm)", 68, "Fries"),
        create_item(tea_post.id, "French Fries Peri Peri Sprinkle (120gm)", 79, "Fries"),
        create_item(tea_post.id, "French Fries Deep Cheezy (140gm)", 95, "Fries"),
        create_item(tea_post.id, "Cheese Butter Sandwich", 53, "Sandwiches"),
        create_item(tea_post.id, "Cheese Chutney Sandwich", 63, "Sandwiches"),
        create_item(tea_post.id, "Mexican Cheese Sandwich", 84, "Sandwiches"),
        create_item(tea_post.id, "Tandoori Paneer Sandwich", 84, "Sandwiches"),
        create_item(tea_post.id, "Cheese Chilli Sandwich", 84, "Sandwiches"),
        create_item(tea_post.id, "Peri Peri Sandwich", 84, "Sandwiches"),
        create_item(tea_post.id, "Schezwan Paneer Sandwich", 84, "Sandwiches"),
        create_item(tea_post.id, "Masala Noodles (150gm)", 42, "Noodles"),
        create_item(tea_post.id, "Tadka Noodles (200gm)", 53, "Noodles", True, 4.7, 230, True),
        create_item(tea_post.id, "Aloo Puff (100gm)", 25, "Puff & Patties"),
        create_item(tea_post.id, "Chinese Puff (100gm)", 32, "Puff & Patties"),
        create_item(tea_post.id, "Mexican Puff (125gm)", 40, "Puff & Patties"),
        create_item(tea_post.id, "Cheese Puff (125gm)", 53, "Puff & Patties"),
        create_item(tea_post.id, "Traditional Tea (Full 100ml)", 24, "Tea"),
        create_item(tea_post.id, "Elaichi Tea (100ml)", 32, "Tea"),
        create_item(tea_post.id, "Ginger Tea (100ml)", 32, "Tea"),
        create_item(tea_post.id, "Indian Masala Tea (100ml)", 32, "Tea", True, 4.9, 450, True),
        create_item(tea_post.id, "Black Tea (160ml)", 32, "Chai without Milk"),
        create_item(tea_post.id, "Green Tea (160ml)", 32, "Chai without Milk"),
        create_item(tea_post.id, "Lemon Ice Tea (250ml)", 63, "Ice Tea"),
        create_item(tea_post.id, "Blueberry Rose Mint Ice Tea (250ml)", 63, "Ice Tea"),
        create_item(tea_post.id, "Peach Ice Tea (250ml)", 63, "Ice Tea"),
        create_item(tea_post.id, "Hot Coffee (100ml)", 30, "Coffee"),
        create_item(tea_post.id, "Hot Vanilla Coffee (100ml)", 42, "Coffee"),
        create_item(tea_post.id, "Cold Coffee (250ml)", 74, "Coffee"),
        create_item(tea_post.id, "Cappuccino Cold Coffee (250ml)", 79, "Coffee"),
        create_item(tea_post.id, "Hazelnut Cold Coffee (250ml)", 79, "Coffee"),
        create_item(tea_post.id, "Hot Chocolate (160ml)", 84, "Milk"),
        create_item(tea_post.id, "Chocolate Shake (250ml)", 74, "Milk Shake"),
        create_item(tea_post.id, "Fruit Punch Cooler (250ml)", 37, "Coolers"),
        create_item(tea_post.id, "Mojito Cooler (250ml)", 42, "Coolers")
    ]

    db.add_all(items)

    # Demo Student User
    demo_user = User(
        email="student@iitgn.ac.in",
        name="Keerthan Varma",
        role=UserRole.STUDENT,
        roll_number="21110001"
    )
    db.add(demo_user)

    db.commit()
    db.close()
    print("✅ CampusQ database successfully seeded with ALL items from 5 campus PDF menus!")

if __name__ == "__main__":
    seed_database()