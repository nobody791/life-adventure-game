// Game Data Configuration
const GameData = {
    // Player starting stats
    initialStats: {
        money: 10000,
        health: 100,
        intelligence: 50,
        reputation: 50,
        age: 18,
        happiness: 70,
        energy: 85,
        jailTime: 0
    },

    // Jobs available
    jobs: [
        { id: 'fastfood', name: 'Fast Food Worker', salary: 800, energyCost: 20, experience: 5 },
        { id: 'retail', name: 'Retail Clerk', salary: 1000, energyCost: 25, experience: 10 },
        { id: 'office', name: 'Office Clerk', salary: 1500, energyCost: 30, experience: 15 },
        { id: 'programmer', name: 'Programmer', salary: 3000, energyCost: 40, experience: 25 },
        { id: 'manager', name: 'Manager', salary: 5000, energyCost: 50, experience: 35 },
        { id: 'ceo', name: 'CEO', salary: 10000, energyCost: 60, experience: 50 }
    ],

    // Education levels
    education: [
        { id: 'highschool', name: 'High School', cost: 0, intelligenceGain: 10, time: 1 },
        { id: 'college', name: 'College Degree', cost: 20000, intelligenceGain: 30, time: 4 },
        { id: 'university', name: 'University', cost: 50000, intelligenceGain: 50, time: 6 },
        { id: 'masters', name: "Master's Degree", cost: 80000, intelligenceGain: 70, time: 8 }
    ],

    // Cars available
    cars: [
        { id: 1, name: 'Old Sedan', price: 5000, comfort: 20, speed: 60, image: '🚗' },
        { id: 2, name: 'Compact Car', price: 15000, comfort: 40, speed: 80, image: '🚙' },
        { id: 3, name: 'Sports Car', price: 50000, comfort: 60, speed: 120, image: '🏎️' },
        { id: 4, name: 'Luxury Sedan', price: 100000, comfort: 80, speed: 100, image: '🚘' },
        { id: 5, name: 'Super Car', price: 250000, comfort: 90, speed: 200, image: '🦽' },
        { id: 6, name: 'Luxury SUV', price: 150000, comfort: 95, speed: 110, image: '🚖' }
    ],

    // Properties available
    properties: [
        { id: 1, name: 'Small Apartment', price: 50000, rent: 500, comfort: 30, image: '🏢' },
        { id: 2, name: 'Modern Apartment', price: 150000, rent: 1500, comfort: 50, image: '🏬' },
        { id: 3, name: 'Townhouse', price: 300000, rent: 3000, comfort: 65, image: '🏠' },
        { id: 4, name: 'Suburban House', price: 500000, rent: 5000, comfort: 75, image: '🏡' },
        { id: 5, name: 'Luxury Villa', price: 1000000, rent: 10000, comfort: 90, image: '🏰' },
        { id: 6, name: 'Mansion', price: 2500000, rent: 25000, comfort: 100, image: '💒' }
    ],

    // Businesses available
    businesses: [
        { id: 1, name: 'Food Truck', price: 20000, income: 1000, risk: 20, management: 10 },
        { id: 2, name: 'Small Shop', price: 50000, income: 2500, risk: 30, management: 15 },
        { id: 3, name: 'Restaurant', price: 150000, income: 8000, risk: 40, management: 25 },
        { id: 4, name: 'Tech Startup', price: 300000, income: 20000, risk: 60, management: 40 },
        { id: 5, name: 'Franchise', price: 500000, income: 35000, risk: 50, management: 30 },
        { id: 6, name: 'Corporation', price: 1000000, income: 75000, risk: 70, management: 50 }
    ],

    // Crime options
    crimes: [
        { id: 'petty', name: 'Petty Theft', minReward: 500, maxReward: 2000, risk: 30, jailChance: 20, jailTime: 30, reputationLoss: 10 },
        { id: 'robbery', name: 'Robbery', minReward: 2000, maxReward: 8000, risk: 50, jailChance: 40, jailTime: 180, reputationLoss: 25 },
        { id: 'bank', name: 'Bank Robbery', minReward: 10000, maxReward: 50000, risk: 70, jailChance: 60, jailTime: 365, reputationLoss: 50 },
        { id: 'heist', name: 'Big Heist', minReward: 50000, maxReward: 200000, risk: 90, jailChance: 80, jailTime: 730, reputationLoss: 75 }
    ],

    // Stock market
    stocks: [
        { id: 'TECH', name: 'Tech Corp', price: 100, volatility: 20 },
        { id: 'AUTO', name: 'Auto Motors', price: 50, volatility: 15 },
        { id: 'FOOD', name: 'Food Chain', price: 30, volatility: 10 },
        { id: 'REAL', name: 'Real Estate Inc', price: 80, volatility: 25 },
        { id: 'BANK', name: 'Bank Group', price: 120, volatility: 18 }
    ],

    // Family members
    familyNames: ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn'],

    // Relationship types
    relationships: [
        { id: 'dating', name: 'Dating', happinessGain: 10, cost: 500 },
        { id: 'engaged', name: 'Engaged', happinessGain: 20, cost: 5000 },
        { id: 'married', name: 'Married', happinessGain: 30, cost: 20000 },
        { id: 'divorced', name: 'Divorced', happinessLoss: 40, cost: 10000 }
    ],

    // Random events
    events: [
        {
            id: 'lottery',
            title: 'Lottery Win!',
            description: 'You bought a lottery ticket and won!',
            choices: [
                { text: 'Take the money', effect: { money: 100000 }, nextEvent: null },
                { text: 'Donate half', effect: { money: 50000, reputation: 20 }, nextEvent: null }
            ]
        },
        {
            id: 'sickness',
            title: 'Health Issue',
            description: 'You feel sick and need medical attention.',
            choices: [
                { text: 'Go to hospital ($5,000)', effect: { money: -5000, health: 30 }, nextEvent: null },
                { text: 'Rest at home', effect: { health: -20, energy: -30 }, nextEvent: null }
            ]
        },
        {
            id: 'investment',
            title: 'Investment Opportunity',
            description: 'A friend offers you an investment opportunity.',
            choices: [
                { text: 'Invest $10,000', effect: { money: -10000 }, nextEvent: 'investment_result' },
                { text: 'Decline', effect: {}, nextEvent: null }
            ]
        }
    ],

    // Inventory items
    items: [
        { id: 'phone', name: 'Smartphone', price: 1000, type: 'electronics' },
        { id: 'laptop', name: 'Laptop', price: 1500, type: 'electronics' },
        { id: 'watch', name: 'Watch', price: 5000, type: 'luxury' },
        { id: 'jewelry', name: 'Jewelry', price: 10000, type: 'luxury' },
        { id: 'tools', name: 'Tool Set', price: 800, type: 'utility' }
    ]
};

export default GameData;
