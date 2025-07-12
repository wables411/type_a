import fs from 'fs';

// Read the meme.html file
let content = fs.readFileSync('public/meme.html', 'utf8');

// Update all remaining trait arrays
const updates = [
    // BEHIND_HEAD_TRAITS
    {
        old: `const BEHIND_HEAD_TRAITS = [
            { name: 'Asuna scarf', path: 'behind head re/asuna%20scarf.png' }, { name: 'Shelter', path: 'behind head re/shelter.png' }
        ];`,
        new: `const BEHIND_HEAD_TRAITS = [
            { name: 'Asuna scarf', path: 'behind head/asuna scarf.png' }, { name: 'Shelter', path: 'behind head/shelter.png' }
        ];`
    },
    // BUN_TRAITS
    {
        old: `const BUN_TRAITS = [
            { name: 'Bun 1', path: 'bun re/bun1.png' }, { name: 'Bun 65', path: 'bun re/bun65.png' },
            { name: 'Bun green 765', path: 'bun re/bungreen765.png' }, { name: 'Panda buns', path: 'bun re/pandabuns.png' },
            { name: 'Pink bun 65', path: 'bun re/pinkbuyn65.png' }
        ];`,
        new: `const BUN_TRAITS = [
            { name: 'Bun 1', path: 'bun/bun1.png' }, { name: 'Bun 65', path: 'bun/bun65.png' },
            { name: 'Bun green 765', path: 'bun/bungreen765.png' }, { name: 'Panda buns', path: 'bun/pandabuns.png' },
            { name: 'Pink bun 65', path: 'bun/pinkbuyn65.png' }
        ];`
    },
    // BODY_TRAITS
    {
        old: `const BODY_TRAITS = [
            { name: 'Apricot', path: 'body re/apricot.png' }, { name: 'Arcturian', path: 'body re/arcturian.png' },
            { name: 'Brown', path: 'body re/brown.png' }, { name: 'Brownie', path: 'body re/brownie.png' },
            { name: 'Cherry', path: 'body re/cherry.png' }, { name: 'Lemon', path: 'body re/lemon.png' },
            { name: 'Metal', path: 'body re/metal.png' }, { name: 'Orange', path: 'body re/orange.png' },
            { name: 'Pink pastel', path: 'body re/pinkpastel.png' }, { name: 'Shrek', path: 'body re/shrek.png' },
            { name: 'Tartarian', path: 'body re/tartarian.png' }, { name: 'Unicorn', path: 'body re/unicorn.png' },
            { name: 'Vanilla', path: 'body re/vanilla.png' }, { name: 'White', path: 'body re/white.png' }
        ];`,
        new: `const BODY_TRAITS = [
            { name: 'Apricot', path: 'body/apricot.png' }, { name: 'Arcturian', path: 'body/arcturian.png' },
            { name: 'Brown', path: 'body/brown.png' }, { name: 'Brownie', path: 'body/brownie.png' },
            { name: 'Cherry', path: 'body/cherry.png' }, { name: 'Lemon', path: 'body/lemon.png' },
            { name: 'Metal', path: 'body/metal.png' }, { name: 'Orange', path: 'body/orange.png' },
            { name: 'Pink pastel', path: 'body/pinkpastel.png' }, { name: 'Shrek', path: 'body/shrek.png' },
            { name: 'Tartarian', path: 'body/tartarian.png' }, { name: 'Unicorn', path: 'body/unicorn.png' },
            { name: 'Vanilla', path: 'body/vanilla.png' }, { name: 'White', path: 'body/white.png' }
        ];`
    }
];

// Apply all updates
updates.forEach(update => {
    content = content.replace(update.old, update.new);
});

// Write the updated content back
fs.writeFileSync('public/meme.html', content);

console.log('Trait arrays updated successfully!'); 