// Game Data Configuration
const gameData = {
    // Jobs Data
    jobs: [
        {
            id: 1,
            title: "Delivery Driver",
            salary: 1500,
            requirements: { intelligence: 30, age: 18 },
            description: "Flexible hours, basic pay",
            icon: "fas fa-motorcycle"
        },
        {
            id: 2,
            title: "Sales Assistant",
            salary: 2200,
            requirements: { intelligence: 40, age: 20 },
            description: "Customer service experience needed",
            icon: "fas fa-shopping-bag"
        },
        {
            id: 3,
            title: "Software Developer",
            salary: 5000,
            requirements: { intelligence: 70, age: 22 },
            description: "Coding skills required",
            icon: "fas fa-code"
        },
        {
            id: 4,
            title: "Business Manager",
            salary: 8000,
            requirements: { intelligence: 85, age: 28 },
            description: "Leadership and management skills",
            icon: "fas fa-briefcase"
        },
        {
            id: 5,
            title: "CEO",
            salary: 20000,
            requirements: { intelligence: 95, age: 35 },
            description: "Run your own company",
            icon: "fas fa-crown"
        }
    ],
    
    // Investments Data
    investments: [
        {
            id: 1,
            title: "Stock Market",
            return: 12,
            risk: "Medium",
            minAmount: 1000,
            description: "Invest in growing companies",
            icon: "fas fa-chart-line"
        },
        {
            id: 2,
            title: "Real Estate",
            return: 8,
            risk: "Low",
            minAmount: 50000,
            description: "Property investment",
            icon: "fas fa-home"
        },
        {
            id: 3,
            title: "Crypto Trading",
            return: 30,
            risk: "High",
            minAmount: 500,
            description: "High risk, high reward",
            icon: "fas fa-coins"
        },
        {
            id: 4,
            title: "Startup Funding",
            return: 25,
            risk: "High",
            minAmount: 10000,
            description: "Invest in new businesses",
            icon: "fas fa-rocket"
        }
    ],
    
    // Dreams Data
    dreams: [
        {
            id: 1,
            title: "Luxury Mansion",
            cost: 500000,
            requirements: { money: 500000, age: 30 },
            description: "Your dream home with everything",
            icon: "fas fa-chess-queen",
            category: "assets"
        },
        {
            id: 2,
            title: "Sports Car",
            cost: 150000,
            requirements: { money: 150000, age: 25 },
            description: "High-performance luxury vehicle",
            icon: "fas fa-car",
            category: "assets"
        },
        {
            id: 3,
            title: "World Tour",
            cost: 50000,
            requirements: { money: 50000, age: 22 },
            description: "Travel to 20+ countries",
            icon: "fas fa-globe-americas",
            category: "experiences"
        },
        {
            id: 4,
            title: "Start Business",
            cost: 100000,
            requirements: { intelligence: 80, age: 28 },
            description: "Launch your own company",
            icon: "fas fa-building",
            category: "career"
        },
        {
            id: 5,
            title: "Family House",
            cost: 250000,
            requirements: { money: 250000, age: 26 },
            description: "Perfect home for your family",
            icon: "fas fa-home",
            category: "family"
        }
    ],
    
    // Achievements Data
    achievements: [
        {
            id: 1,
            title: "First Job",
            description: "Got your first job",
            icon: "fas fa-briefcase",
            unlocked: true
        },
        {
            id: 2,
            title: "Savings Goal",
            description: "Saved $10,000",
            icon: "fas fa-piggy-bank",
            unlocked: false
        },
        {
            id: 3,
            title: "Degree Complete",
            description: "Graduated from university",
            icon: "fas fa-graduation-cap",
            unlocked: false
        },
        {
            id: 4,
            title: "First Car",
            description: "Bought your first vehicle",
            icon: "fas fa-car",
            unlocked: false
        },
        {
            id: 5,
            title: "Married",
            description: "Found your life partner",
            icon: "fas fa-ring",
            unlocked: false
        },
        {
            id: 6,
            title: "Parent",
            description: "Had your first child",
            icon: "fas fa-baby",
            unlocked: false
        },
        {
            id: 7,
            title: "Millionaire",
            description: "Reached $1,000,000 net worth",
            icon: "fas fa-money-bill-wave",
            unlocked: false
        }
    ],
    
    // Events Data
    events: [
        {
            id: 1,
            title: "New job opportunity available",
            description: "Check the work section",
            icon: "fas fa-briefcase",
            time: "2 hours ago"
        },
        {
            id: 2,
            title: "Stock prices are rising",
            description: "Good time to invest",
            icon: "fas fa-chart-line",
            time: "1 day ago"
        },
        {
            id: 3,
            title: "Friend's birthday party",
            description: "Social event this weekend",
            icon: "fas fa-birthday-cake",
            time: "3 days ago"
        }
    ],
    
    // Family Data
    family: [
        {
            id: 1,
            name: "Sarah",
            relation: "Partner",
            happiness: 80,
            icon: "fas fa-female"
        },
        {
            id: 2,
            name: "Alex",
            relation: "Child",
            happiness: 90,
            icon: "fas fa-child"
        }
    ],
    
    // Assets Data
    assets: [
        {
            id: 1,
            name: "Small Apartment",
            value: 50000,
            type: "property",
            icon: "fas fa-home"
        },
        {
            id: 2,
            name: "Basic Car",
            value: 15000,
            type: "vehicle",
            icon: "fas fa-car"
        }
    ]
};

// Days of week and months
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Game settings
const GAME_SETTINGS = {
    startingMoney: 10000,
    startingAge: 18,
    startingIntelligence: 50,
    startingHealth: 100,
    maxAge: 100,
    tickInterval: 30000, // 30 seconds real time = 1 month game time
    autoSaveInterval: 60000 // Auto-save every minute
};

export { gameData, DAYS, MONTHS, GAME_SETTINGS };