import fs from "fs";

const categories = [
    "Movie",
    "Series",
    "Characters",
    "Food",
    "Meme",
    "Place",
    "Country",
    "Anime",
    "fairy tales"
];

const API_URL = "https://chameleon.theo.io/api/generateTiles";

async function fetchCategory(theme) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ theme })
    });

    if (!res.ok) {
        throw new Error(`API error for theme "${theme}": ${res.status}`);
    }

    const data = await res.json();

    // EXACT structure you showed
    return data.items;
}

async function main() {
    const words = [];

    for (let c = 0; c < categories.length; c++) {
        const category = categories[c];
        const categoryArrays = [];

        for (let i = 0; i < 3; i++) {
            console.log(`Fetching ${category} (${i + 1}/3)`);
            const items = await fetchCategory(category);
            categoryArrays.push(items);
        }

        words.push(categoryArrays);
    }

    const output = `// auto-generated
export const words = ${JSON.stringify(words, null, 2)};
`;

    fs.writeFileSync("categories.ts", output, "utf8");
    console.log("categories.ts created ✅");
}

main().catch(console.error);
