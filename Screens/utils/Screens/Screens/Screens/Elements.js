import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --- Static Data: Periodic Table Elements ---
// This dataset is crucial for the app's functionality
const ELEMENT_DATA = [
    { atomic_number: 1, symbol: 'H', name: 'Hydrogen', atomic_mass: 1.008, density: 0.08988, melting_point: -259.16, boiling_point: -252.87, category: 'nonmetal', electronic_configuration: '1s¹' },
    { atomic_number: 2, symbol: 'He', name: 'Helium', atomic_mass: 4.0026, density: 0.1786, melting_point: -272.2, boiling_point: -268.93, category: 'noble_gas', electronic_configuration: '1s²' },
    { atomic_number: 3, symbol: 'Li', name: 'Lithium', atomic_mass: 6.94, density: 0.534, melting_point: 180.5, boiling_point: 1342, category: 'alkali_metal', electronic_configuration: '[He] 2s¹' },
    { atomic_number: 4, symbol: 'Be', name: 'Beryllium', atomic_mass: 9.0122, density: 1.85, melting_point: 1287, boiling_point: 2471, category: 'alkaline_earth_metal', electronic_configuration: '[He] 2s²' },
    { atomic_number: 5, symbol: 'B', name: 'Boron', atomic_mass: 10.81, density: 2.34, melting_point: 2076, boiling_point: 3927, category: 'metalloid', electronic_configuration: '[He] 2s² 2p¹' },
    { atomic_number: 6, symbol: 'C', symbol: 'C', name: 'Carbon', atomic_mass: 12.011, density: 2.267, melting_point: 3500, boiling_point: 4827, category: 'nonmetal', electronic_configuration: '[He] 2s² 2p²' },
    { atomic_number: 7, symbol: 'N', name: 'Nitrogen', atomic_mass: 14.007, density: 1.251, melting_point: -210.0, boiling_point: -195.8, category: 'nonmetal', electronic_configuration: '[He] 2s² 2p³' },
    { atomic_number: 8, symbol: 'O', name: 'Oxygen', atomic_mass: 15.999, density: 1.429, melting_point: -218.4, boiling_point: -183.0, category: 'nonmetal', electronic_configuration: '[He] 2s² 2p⁴' },
    { atomic_number: 9, symbol: 'F', name: 'Fluorine', atomic_mass: 18.998, density: 1.696, melting_point: -219.6, boiling_point: -188.1, category: 'halogen', electronic_configuration: '[He] 2s² 2p⁵' },
    { atomic_number: 10, symbol: 'Ne', name: 'Neon', atomic_mass: 20.180, density: 0.9, melting_point: -248.59, boiling_point: -246.08, category: 'noble_gas', electronic_configuration: '[He] 2s² 2p⁶' },
    { atomic_number: 11, symbol: 'Na', name: 'Sodium', atomic_mass: 22.990, density: 0.968, melting_point: 97.72, boiling_point: 883, category: 'alkali_metal', electronic_configuration: '[Ne] 3s¹' },
    { atomic_number: 12, symbol: 'Mg', name: 'Magnesium', atomic_mass: 24.305, density: 1.738, melting_point: 650, boiling_point: 1090, category: 'alkaline_earth_metal', electronic_configuration: '[Ne] 3s²' },
    { atomic_number: 13, symbol: 'Al', name: 'Aluminum', atomic_mass: 26.982, density: 2.70, melting_point: 660.32, boiling_point: 2519, category: 'post_transition_metal', electronic_configuration: '[Ne] 3s² 3p¹' },
    { atomic_number: 14, symbol: 'Si', name: 'Silicon', atomic_mass: 28.085, density: 2.329, melting_point: 1414, boiling_point: 3265, category: 'metalloid', electronic_configuration: '[Ne] 3s² 3p²' },
    { atomic_number: 15, symbol: 'P', name: 'Phosphorus', atomic_mass: 30.974, density: 1.823, melting_point: 44.15, boiling_point: 280.5, category: 'nonmetal', electronic_configuration: '[Ne] 3s² 3p³' },
    { atomic_number: 16, symbol: 'S', name: 'Sulfur', atomic_mass: 32.06, density: 2.07, melting_point: 115.2, boiling_point: 444.6, category: 'nonmetal', electronic_configuration: '[Ne] 3s² 3p⁴' },
    { atomic_number: 17, symbol: 'Cl', name: 'Chlorine', atomic_mass: 35.45, density: 3.2, melting_point: -101.5, boiling_point: -34.04, category: 'halogen', electronic_configuration: '[Ne] 3s² 3p⁵' },
    { atomic_number: 18, symbol: 'Ar', name: 'Argon', atomic_mass: 39.948, density: 1.784, melting_point: -189.3, boiling_point: -185.8, category: 'noble_gas', electronic_configuration: '[Ne] 3s² 3p⁶' },
    { atomic_number: 19, symbol: 'K', name: 'Potassium', atomic_mass: 39.098, density: 0.862, melting_point: 63.38, boiling_point: 759, category: 'alkali_metal', electronic_configuration: '[Ar] 4s¹' },
    { atomic_number: 20, symbol: 'Ca', name: 'Calcium', atomic_mass: 40.078, density: 1.55, melting_point: 842, boiling_point: 1484, category: 'alkaline_earth_metal', electronic_configuration: '[Ar] 4s²' },
    { atomic_number: 24, symbol: 'Cr', name: 'Chromium', atomic_mass: 51.996, density: 7.19, melting_point: 1857, boiling_point: 2671, category: 'transition_metal', electronic_configuration: '[Ar] 3d⁵ 4s¹' },
    { atomic_number: 26, symbol: 'Fe', name: 'Iron', atomic_mass: 55.845, density: 7.87, melting_point: 1538, boiling_point: 2862, category: 'transition_metal', electronic_configuration: '[Ar] 3d⁶ 4s²' },
    { atomic_number: 29, symbol: 'Cu', name: 'Copper', atomic_mass: 63.546, density: 8.96, melting_point: 1084.6, boiling_point: 2560, category: 'transition_metal', electronic_configuration: '[Ar] 3d¹⁰ 4s¹' },
    { atomic_number: 47, symbol: 'Ag', name: 'Silver', atomic_mass: 107.87, density: 10.49, melting_point: 961.78, boiling_point: 2162, category: 'transition_metal', electronic_configuration: '[Kr] 4d¹⁰ 5s¹' },
    { atomic_number: 79, symbol: 'Au', name: 'Gold', atomic_mass: 196.97, density: 19.3, melting_point: 1064.18, boiling_point: 2856, category: 'transition_metal', electronic_configuration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹' },
    { atomic_number: 80, symbol: 'Hg', name: 'Mercury', atomic_mass: 200.59, density: 13.534, melting_point: -38.83, boiling_point: 356.73, category: 'transition_metal', electronic_configuration: '[Xe] 4f¹⁴ 5d¹⁰ 6s²' },
];

// --- Utility Functions ---

// Function to map the element category string to a display color
const getCategoryColor = (category) => {
  switch (category) {
    case 'alkali_metal': return '#f44336'; // Red
    case 'alkaline_earth_metal': return '#ff9800'; // Orange
    case 'transition_metal': return '#4caf50'; // Green
    case 'post_transition_metal': return '#03a9f4'; // Light Blue
    case 'metalloid': return '#ffeb3b'; // Yellow (needs dark text)
    case 'nonmetal': return '#9e9e9e'; // Gray
    case 'halogen': return '#e91e63'; // Pink
    case 'noble_gas': return '#9c27b0'; // Purple
    default: return '#cccccc';
  }
};

// --- Helper Components ---

// Component for a single element property line
const PropertyLine = ({ label, value, unit }) => (
    <View style={styles.propertyLine}>
        <Text style={styles.propertyLabel}>{label}:</Text>
        <Text style={styles.propertyValue}>{value} {unit}</Text>
    </View>
);

// Component to display the full details of a selected element
const ElementDetails = ({ element }) => {
    const categoryColor = getCategoryColor(element.category);
    const categoryName = element.category.replace(/_/g, ' ').toUpperCase();

    return (
        <ScrollView style={styles.detailsContainer}>
            <View style={[styles.headerCard, { borderLeftColor: categoryColor }]}>
                <Text style={styles.elementSymbol}>{element.symbol}</Text>
                <Text style={styles.elementName}>{element.name}</Text>
                <Text style={styles.elementNumber}>Atomic Number: {element.atomic_number}</Text>
                <Text style={[styles.categoryPill, { backgroundColor: categoryColor, color: element.category === 'metalloid' ? '#333' : 'white' }]}>
                    {categoryName}
                </Text>
            </View>

            <View style={styles.propertiesCard}>
                <Text style={styles.propertiesTitle}>Key Physical Properties</Text>
                <PropertyLine label="Atomic Mass" value={element.atomic_mass.toFixed(3)} unit="u" />
                <PropertyLine label="Density" value={element.density} unit="g/L" />
                <PropertyLine label="Melting Point" value={element.melting_point.toFixed(2)} unit="°C" />
                <PropertyLine label="Boiling Point" value={element.boiling_point.toFixed(2)} unit="°C" />
            </View>

            <View style={styles.propertiesCard}>
                <Text style={styles.propertiesTitle}>Quantum Information</Text>
                <PropertyLine label="Electronic Config" value={element.electronic_configuration} unit="" />
            </View>
        </ScrollView>
    );
};


// --- Main Elements Screen Component ---

const ElementsScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedElement, setSelectedElement] = useState(null);

    // Filter elements based on search text (optimized with useMemo)
    const filteredElements = useMemo(() => {
        if (!searchText) {
            return ELEMENT_DATA;
        }
        const lowerCaseSearch = searchText.toLowerCase();
        return ELEMENT_DATA.filter(element => 
            element.name.toLowerCase().includes(lowerCaseSearch) ||
            element.symbol.toLowerCase() === lowerCaseSearch ||
            element.atomic_number.toString() === lowerCaseSearch
        );
    }, [searchText]);

    // Automatically select the element if only one result is left
    useEffect(() => {
        if (filteredElements.length === 1 && filteredElements[0].name !== selectedElement?.name) {
             setSelectedElement(filteredElements[0]);
        }
    }, [filteredElements]);

    const handleSelectElement = (element) => {
        setSelectedElement(element);
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by Name, Symbol, or Atomic Number"
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                {searchText.length > 0 && (
                     <TouchableOpacity style={styles.clearButton} onPress={() => setSearchText('')}>
                        <Ionicons name="close-circle" size={20} color="#777" />
                     </TouchableOpacity>
                )}
            </View>

            {selectedElement && (
                <View style={styles.detailsArea}>
                    <ElementDetails element={selectedElement} />
                </View>
            )}

            {/* Display search results or initial list */}
            {searchText.length > 0 && filteredElements.length === 0 && (
                <Text style={styles.noResults}>No elements match your search criteria.</Text>
            )}

            <ScrollView contentContainerStyle={styles.listContent}>
                {!selectedElement && filteredElements.map(element => (
                    <TouchableOpacity 
                        key={element.atomic_number}
                        style={[styles.listItem, { borderLeftColor: getCategoryColor(element.category) }]}
                        onPress={() => handleSelectElement(element)}
                    >
                        <View style={styles.listTextContainer}>
                            <Text style={styles.listName}>{element.name} ({element.symbol})</Text>
                            <Text style={styles.listDetails}>Atomic Mass: {element.atomic_mass.toFixed(3)} u</Text>
                        </View>
                        <View style={styles.listNumberPill}>
                            <Text style={styles.listNumber}>{element.atomic_number}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// --- Styling ---

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f0f4f7',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 15,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: width * 0.9,
        alignSelf: 'center',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    clearButton: {
        marginLeft: 10,
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
        width: width,
        alignItems: 'center',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderLeftWidth: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        width: width * 0.9,
        maxWidth: 500,
    },
    listTextContainer: {
        flex: 1,
    },
    listName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    listDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    listNumberPill: {
        backgroundColor: '#e0e0e0',
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    listNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    // Element Details Styles
    detailsArea: {
        flex: 1,
        width: width,
        alignItems: 'center',
    },
    detailsContainer: {
        flex: 1,
        width: width * 0.9,
        maxWidth: 500,
    },
    headerCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        borderLeftWidth: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    elementSymbol: {
        fontSize: 72,
        fontWeight: '900',
        color: '#333',
        lineHeight: 80,
    },
    elementName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    elementNumber: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    categoryPill: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        fontWeight: 'bold',
        marginTop: 5,
    },
    propertiesCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    propertiesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    propertyLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    propertyLabel: {
        fontSize: 16,
        color: '#333',
    },
    propertyValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    noResults: {
        fontSize: 18,
        color: '#dc3545',
        textAlign: 'center',
        marginTop: 30,
    }
});

export default ElementsScreen;
