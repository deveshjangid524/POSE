#!/usr/bin/env python3
"""
Earth Engine Python API for Node.js integration
"""

import ee
import json
import sys
import os
import webbrowser

# Load environment variables from .env file manually
def load_env_file():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    # Remove quotes from value if present
                    value = value.strip().strip('"\'')
                    os.environ[key.strip()] = value.strip()

load_env_file()

def initialize_earth_engine():
    """Initialize Earth Engine using existing authentication"""
    try:
        # Get project ID from environment variables
        project_id = os.getenv('PROJECT_ID')
        
        if project_id:
            # Try to initialize with the specified project
            ee.Initialize(project=project_id)
            return {"success": True, "message": f"Earth Engine initialized with project: {project_id}"}
        else:
            # Try to initialize without specifying project (let Earth Engine handle it)
            ee.Initialize()
            return {"success": True, "message": "Earth Engine initialized successfully"}
        
    except Exception as e:
        try:
            # If still failing, try to authenticate
            print("Authentication required. Opening browser...")
            ee.Authenticate()
            
            # Try again with project if available
            project_id = os.getenv('PROJECT_ID')
            if project_id:
                ee.Initialize(project=project_id)
                return {"success": True, "message": f"Earth Engine authenticated and initialized with project: {project_id}"}
            else:
                ee.Initialize()
                return {"success": True, "message": "Earth Engine authenticated and initialized successfully"}
                
        except Exception as e2:
            return {"error": f"Authentication failed: {str(e2)}"}

def get_image_info(image_id):
    """Get information about a specific Earth Engine image"""
    try:
        image = ee.Image(image_id)
        info = image.getInfo()
        
        return {
            "success": True,
            "data": {
                "id": info.get("id"),
                "bands": len(info.get("bands", [])),
                "properties": len(info.get("properties", {})),
                "band_names": [band.get("id") for band in info.get("bands", [])]
            }
        }
        
    except Exception as e:
        return {"error": str(e)}

def calculate_mean_values(image_id, geometry_coords, scale=30):
    """Calculate mean values for an image in a given region"""
    try:
        image = ee.Image(image_id)
        geometry = ee.Geometry.Rectangle(geometry_coords)
        
        mean_dict = image.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=geometry,
            scale=scale,
            maxPixels=1e9
        )
        
        mean_values = mean_dict.getInfo()
        
        return {
            "success": True,
            "data": {
                "mean_values": mean_values,
                "available_bands": list(mean_values.keys())
            }
        }
        
    except Exception as e:
        return {"error": str(e)}

def list_collections():
    """List available Earth Engine image collections"""
    try:
        collections = [
            "LANDSAT/LC08/C01/T1_SR",
            "LANDSAT/LE07/C01/T1_SR",
            "LANDSAT/LT05/C01/T1_SR",
            "COPERNICUS/S2_SR",
            "MODIS/006/MOD13Q1"
        ]
        
        return {
            "success": True,
            "data": {
                "available_collections": collections,
                "count": len(collections)
            }
        }
        
    except Exception as e:
        return {"error": str(e)}

def get_sentinel1_data():
    """Get Sentinel-1 satellite data and display first 5 rows"""
    try:
        # Get project ID from environment variables
        project_id = os.getenv('PROJECT_ID')
        
        # Initialize Earth Engine with project
        if project_id:
            ee.Initialize(project=project_id)
        else:
            ee.Initialize()
        
        # Load Sentinel-1 GRD collection
        collection = ee.ImageCollection('COPERNICUS/S1_GRD')
        
        # Filter by date (last 30 days) and instrument mode
        from datetime import datetime, timedelta
        now = datetime.now()
        start_date = now - timedelta(days=30)
        
        # Convert to Earth Engine dates
        ee_now = ee.Date(now.strftime('%Y-%m-%d'))
        ee_start_date = ee.Date(start_date.strftime('%Y-%m-%d'))
        
        filtered = collection.filterDate(ee_start_date, ee_now)\
                            .filter(ee.Filter.eq('instrumentMode', 'IW'))\
                            .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))\
                            .limit(5)
        
        # Get collection info
        collection_info = filtered.getInfo()
        
        # Extract first 5 images data
        first_5_images = []
        for i, image in enumerate(collection_info.get('features', [])):
            image_data = {
                "index": i + 1,
                "id": image.get('id'),
                "properties": image.get('properties', {}),
                "bands": [band.get('id') for band in image.get('bands', [])]
            }
            first_5_images.append(image_data)
        
        return {
            "success": True,
            "data": {
                "message": "Sentinel-1 data retrieved successfully",
                "first_5_images": first_5_images,
                "total_images_in_collection": collection_info.get('features', []).__len__()
            }
        }
        
    except Exception as e:
        return {"error": str(e)}

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command specified"}))
        return
    
    command = sys.argv[1]
    
    if command == "init":
        result = initialize_earth_engine()
        
    elif command == "image_info":
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Image ID required"}))
            return
        image_id = sys.argv[2]
        result = get_image_info(image_id)
        
    elif command == "mean_values":
        if len(sys.argv) < 4:
            print(json.dumps({"error": "Image ID and geometry coordinates required"}))
            return
        image_id = sys.argv[2]
        try:
            coords = json.loads(sys.argv[3])
            result = calculate_mean_values(image_id, coords)
        except json.JSONDecodeError:
            result = {"error": "Invalid geometry coordinates"}
            
    elif command == "collections":
        result = list_collections()
        
    elif command == "sentinel1":
        result = get_sentinel1_data()
        
    else:
        result = {"error": f"Unknown command: {command}"}
    
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
