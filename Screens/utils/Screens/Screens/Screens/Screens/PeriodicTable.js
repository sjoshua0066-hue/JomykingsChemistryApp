import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// --- Simplified Element Data for Grid Visualization ---
// This data focuses on the grid position (x, y) and key properties for display.
const GRID_DATA = [
    { n: 1, s: 'H', x: 1, y: 1, c: 'nonmetal' },
    { n: 2, s: 'He', x: 18, y: 1, c: 'noble_gas' },
    { n: 3, s: 'Li', x: 1, y: 2, c: 'alkali_metal' },
    { n: 4, s: 'Be', x: 2, y: 2, c: 'alkaline_earth_metal' },
    { n: 5, s: 'B', x: 13, y: 2, c: 'metalloid' },
    { n: 6, s: 'C', x: 14, y: 2, c: 'nonmetal' },
    { n: 7, s: 'N', x: 15, y: 2, c: 'nonmetal' },
    { n: 8, s: 'O', x: 16, y: 2, c: 'nonmetal' },
    { n: 9, s: 'F', x: 17, y: 2, c: 'halogen' },
    { n: 10, s: 'Ne', x: 18, y: 2, c: 'noble_gas' },
    { n: 11, s: 'Na', x: 1, y: 3, c: 'alkali_metal' },
    { n: 12, s: 'Mg', x: 2, y: 3, c: 'alkaline_earth_metal' },
    { n: 13, s: 'Al', x: 13, y: 3, c: 'post_transition_metal' },
    { n: 14, s: 'Si', x: 14, y: 3, c: 'metalloid' },
    { n: 15, s: 'P', x: 15, y: 3, c: 'nonmetal' },
    { n: 16, s: 'S', x: 16, y: 3, c: 'nonmetal' },
    { n: 17, s: 'Cl', x: 17, y: 3, c: 'halogen' },
    { n: 18, s: 'Ar', x: 18, y: 3, c: 'noble_gas' },
    { n: 19, s: 'K', x: 1, y: 4, c: 'alkali_metal' },
    { n: 20, s: 'Ca', x: 2, y: 4, c: 'alkaline_earth_metal' },
    { n: 21, s: 'Sc', x: 3, y: 4, c: 'transition_metal' },
    { n: 22, s: 'Ti', x: 4, y: 4, c: 'transition_metal' },
    { n: 23, s: 'V', x: 5, y: 4, c: 'transition_metal' },
    { n: 24, s: 'Cr', x: 6, y: 4, c: 'transition_metal' },
    { n: 25, s: 'Mn', x: 7, y: 4, c: 'transition_metal' },
    { n: 26, s: 'Fe', x: 8, y: 4, c: 'transition_metal' },
    { n: 27, s: 'Co', x: 9, y: 4, c: 'transition_metal' },
    { n: 28, s: 'Ni', x: 10, y: 4, c: 'transition_metal' },
    { n: 29, s: 'Cu', x: 11, y: 4, c: 'transition_metal' },
    { n: 30, s: 'Zn', x: 12, y: 4, c: 'transition_metal' },
    { n: 31, s: 'Ga', x: 13, y: 4, c: 'post_transition_metal' },
    { n: 32, s: 'Ge', x: 14, y: 4, c: 'metalloid' },
    { n: 33, s: 'As', x: 15, y: 4, c: 'metalloid' },
    { n: 34, s: 'Se', x: 16, y: 4, c: 'nonmetal' },
    { n: 35, s: 'Br', x: 17, y: 4, c: 'halogen' },
    { n: 36, s: 'Kr', x: 18, y: 4, c: 'noble_gas' },
    
    // ... Lanthanides and Actinides placeholder rows
    { n: 57, s: 'La-Lu', x: 3, y: 6, c: 'lanthanide' }, // Lanthanide Series
    { n: 89, s: 'Ac-Lr', x: 3, y: 7, c: 'actinide' }, // Actinide Series
];

// --- Utility Functions ---
const getCategoryColor = (category) => {
    switch (category) {
        case 'alkali_metal': return '#f44336'; 
        case 'alkaline_earth_metal': return '#ff9800'; 
        case 'transition_metal': return '#4caf50'; 
        case 'post_transition_metal': return '#03a9f4'; 
        case 'metalloid': return '#ffeb3b';
        case 'nonmetal': return '#9e9e9e'; 
        case 'halogen': return '#e91e63'; 
        case 'noble_gas': return '#9c27b0'; 
        case 'lanthanide': return '#8bc34a';
        case 'actinide': return '#ff5722';
        default: return '#cccccc';
    }
};

// --- Element Tile Component ---
const ElementTile = ({ element, onPress }) => {
    const categoryColor = getCategoryColor(element.c);

    // Calculate position in the 18-column grid
    const style = {
        gridColumnStart: element.x,
        gridRowStart: element.y,
        backgroundColor: categoryColor,
        borderColor: categoryColor,
        // Special case for Lanthanide/Actinide links
        ...(element.s.includes('-') && {
            gridColumnEnd: element.x + 10, // Span a few columns for label
            backgroundColor: '#fff',
            borderColor: '#666',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
        })
    };

    return (
        <TouchableOpacity style={[styles.elementTile, style]} onPress={onPress}>
            {element.s.includes('-') ? (
                 <Text style={styles.tilePlaceholderText}>{element.s}</Text>
            ) : (
                <>
                    <Text style={styles.tileNumber}>{element.n}</Text>
                    <Text style={styles.tileSymbol}>{element.s}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};


// --- Main Periodic Table Component ---

const PeriodicTableScreen = ({ navigation }) => {
    // Navigate to the Elements screen and search for the tapped element
    const handleElementPress = (symbol) => {
        // We navigate to the Elements screen and pass the symbol as a search query.
        navigation.navigate('Elements', { search: symbol });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.headerTitle}>Interactive Periodic Table</Text>
            <Text style={styles.headerSubTitle}>Tap any element for detailed information.</Text>
            
            {/* The main grid container */}
            <View style={styles.grid}>
                {GRID_DATA.map((element, index) => (
                    <ElementTile 
                        key={index} 
                        element={element} 
                        onPress={() => handleElementPress(element.s)} 
                    />
                ))}
            </View>

            <Text style={styles.noteText}>
                Note: The full table includes elements up to 118, but a representative subset is displayed for demonstration and layout integrity.
            </Text>
        </ScrollView>
    );
};

// --- Styling ---

const TILE_SIZE = (width > 600 ? 50 : 35); // Larger tiles on tablets/wider screens

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    contentContainer: {
        alignItems: 'center',
        padding: 10,
        paddingBottom: 50,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 5,
    },
    headerSubTitle: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 20,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', // 18 columns
        gridTemplateRows: 'repeat(7, minmax(0, 1fr))',    // 7 main periods
        gap: 2, // Minimal gap between tiles
        width: '95%',
        maxWidth: 800,
        aspectRatio: 18 / 9, // Approximate aspect ratio of the table layout
        marginBottom: 20,
    },
    elementTile: {
        height: TILE_SIZE, 
        width: '100%',
        margin: 0,
        padding: 2,
        borderRadius: 4,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderWidth: 1,
    },
    tileNumber: {
        fontSize: TILE_SIZE * 0.3,
        fontWeight: '600',
        color: '#fff',
        alignSelf: 'flex-start',
    },
    tileSymbol: {
        fontSize: TILE_SIZE * 0.5,
        fontWeight: 'bold',
        color: '#fff',
        alignSelf: 'center',
        lineHeight: TILE_SIZE * 0.5,
        marginBottom: 2,
    },
    tilePlaceholderText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    noteText: {
        fontSize: 12,
        color: '#6c757d',
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    }
});

export default PeriodicTableScreen;
