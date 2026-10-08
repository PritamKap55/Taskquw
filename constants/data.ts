export const list = {
    values: [
        {
            text: "Rice 1 kg",
            note: "",
            bool: false
        },
        {
            text: "Dal 1/2 kg",
            note: "",
            bool: true
        },
        {
            text: "Cooking oil 4 L",
            note: "3 liters purchase",
            bool: true
        },
        {
            text: "Salt 1 kg",
            note: "",
            bool: true
        },
        {
            text: "Sugar 2 kg",
            note: "",
            bool: true
        },
        {
            text: "Milk 2 L",
            note: "",
            bool: true
        },
        {
            text: "Eggs 2 N",
            note: "",
            bool: false
        },
        {
            text: "Soap 2",
            note: "",
            bool: true
        },
        {
            text: "Tomatoes 2 kg",
            note: "",
            bool: true
        },
        {
            text: "Green vegetables",
            note: "Fenugreek leaves, Okra",
            bool: true
        },
        {
            text: "Fruits ",
            note: "",
            bool: true
        },
        {
            text: "Onions 3 kg",
            note: "",
            bool: true
        },
        {
            text: "",
            note: "",
            bool: true
        }
    ]
};

export type TreeNodeType = {
    id: number;
    name: string;
    parent: number;
    rowNumber: number;
    children: TreeNodeType[];
};

export const treeview: TreeNodeType[] = [
    {
        id: 1,
        name: "Vegetables",
        parent: 0,
        rowNumber: 1,
        children: [
            {
                id: 2,
                name: "Leafy Vegetables",
                parent: 1,
                rowNumber: 2,
                children: [
                    {
                        id: 3,
                        name: "Spinach",
                        parent: 2,
                        rowNumber: 3,
                        children: [],
                    },
                    {
                        id: 4,
                        name: "Methi",
                        parent: 2,
                        rowNumber: 4,
                        children: [],
                    },
                    {
                        id: 5,
                        name: "Coriander",
                        parent: 2,
                        rowNumber: 5,
                        children: [],
                    },
                ],
            },
            {
                id: 6,
                name: "Daily Vegetables",
                parent: 1,
                rowNumber: 6,
                children: [
                    {
                        id: 7,
                        name: "Tomato",
                        parent: 6,
                        rowNumber: 7,
                        children: [],
                    },
                    {
                        id: 8,
                        name: "Potato",
                        parent: 6,
                        rowNumber: 8,
                        children: [],
                    },
                    {
                        id: 9,
                        name: "Onion",
                        parent: 6,
                        rowNumber: 9,
                        children: [],
                    },
                    {
                        id: 10,
                        name: "Brinjal",
                        parent: 6,
                        rowNumber: 10,
                        children: [],
                    },
                ],
            },
        ],
    },

    {
        id: 11,
        name: "Grocery",
        parent: 0,
        rowNumber: 11,
        children: [
            {
                id: 12,
                name: "Grains & Pulses",
                parent: 11,
                rowNumber: 12,
                children: [
                    {
                        id: 13,
                        name: "Rice",
                        parent: 12,
                        rowNumber: 13,
                        children: [],
                    },
                    {
                        id: 14,
                        name: "Wheat",
                        parent: 12,
                        rowNumber: 14,
                        children: [],
                    },
                    {
                        id: 15,
                        name: "Dal",
                        parent: 12,
                        rowNumber: 15,
                        children: [],
                    },
                ],
            },
            {
                id: 16,
                name: "Oil & Spices",
                parent: 11,
                rowNumber: 16,
                children: [
                    {
                        id: 17,
                        name: "Cooking Oil",
                        parent: 16,
                        rowNumber: 17,
                        children: [],
                    },
                    {
                        id: 18,
                        name: "Salt",
                        parent: 16,
                        rowNumber: 18,
                        children: [],
                    },
                    {
                        id: 19,
                        name: "Turmeric",
                        parent: 16,
                        rowNumber: 19,
                        children: [],
                    },
                ],
            },
        ],
    },

    {
        id: 20,
        name: "Clothes",
        parent: 0,
        rowNumber: 20,
        children: [
            {
                id: 21,
                name: "Men's Clothes",
                parent: 20,
                rowNumber: 21,
                children: [
                    {
                        id: 22,
                        name: "Shirt",
                        parent: 21,
                        rowNumber: 22,
                        children: [],
                    },
                    {
                        id: 23,
                        name: "T-Shirt",
                        parent: 21,
                        rowNumber: 23,
                        children: [],
                    },
                    {
                        id: 24,
                        name: "Jeans",
                        parent: 21,
                        rowNumber: 24,
                        children: [],
                    },
                ],
            },
            {
                id: 25,
                name: "Women's Clothes",
                parent: 20,
                rowNumber: 25,
                children: [
                    {
                        id: 26,
                        name: "Kurti",
                        parent: 25,
                        rowNumber: 26,
                        children: [],
                    },
                    {
                        id: 27,
                        name: "Saree",
                        parent: 25,
                        rowNumber: 27,
                        children: [],
                    },
                    {
                        id: 28,
                        name: "Dress",
                        parent: 25,
                        rowNumber: 28,
                        children: [],
                    },
                ],
            },
        ],
    },

    {
        id: 29,
        name: "Hardware",
        parent: 0,
        rowNumber: 29,
        children: [
            {
                id: 30,
                name: "Tools",
                parent: 29,
                rowNumber: 30,
                children: [
                    {
                        id: 31,
                        name: "Hammer",
                        parent: 30,
                        rowNumber: 31,
                        children: [],
                    },
                    {
                        id: 32,
                        name: "Screwdriver",
                        parent: 30,
                        rowNumber: 32,
                        children: [],
                    },
                    {
                        id: 33,
                        name: "Pliers",
                        parent: 30,
                        rowNumber: 33,
                        children: [],
                    },
                ],
            },
            {
                id: 34,
                name: "Electrical",
                parent: 29,
                rowNumber: 34,
                children: [
                    {
                        id: 35,
                        name: "Bulb",
                        parent: 34,
                        rowNumber: 35,
                        children: [],
                    },
                    {
                        id: 36,
                        name: "Switch",
                        parent: 34,
                        rowNumber: 36,
                        children: [],
                    },
                    {
                        id: 37,
                        name: "Wire",
                        parent: 34,
                        rowNumber: 37,
                        children: [],
                    },
                ],
            },
        ],
    },
];

// data.ts

export const tableData: (string | number)[][] = [
    ["Items", "Stock", "Price", "Category", "Supplier"],
    ["Vegetables", 40, 120, "Food", "Fresh Mart"],
    ["Grocery", 55, 250, "Food", "Daily Needs"],
    ["Clothes", 28, 850, "Fashion", "Style Hub"],
    ["Hardware", 35, 450, "Tools", "Tool World"],
    ["Electronics", 18, 1250, "Electronics", "Tech Store"],
    ["Furniture", 12, 5500, "Home", "Home Center"],
    ["Shoes", 25, 1200, "Fashion", "Footwear Hub"],
    ["Stationery", 60, 80, "Office", "Paper House"],
    ["Cosmetics", 32, 450, "Beauty", "Beauty Point"],
    ["Kitchenware", 20, 750, "Kitchen", "Kitchen World"],
    ["Toys", 45, 350, "Kids", "Toy Store"],
    ["Books", 38, 300, "Education", "Book House"],
    ["Sports", 22, 900, "Fitness", "Sport Center", ],
    ["Medicines", 50, 180, "Healthcare", "Health Mart"],
    ["Gardening", 16, 650, "Garden", "Green World"],
];