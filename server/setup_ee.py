#!/usr/bin/env python3
"""
Setup script for Earth Engine authentication
"""

import ee
import webbrowser
import os

def setup_authentication():
    """Set up Earth Engine authentication"""
    try:
        print("Setting up Earth Engine authentication...")
        
        # Check if already authenticated
        try:
            ee.Initialize()
            print("Already authenticated!")
            return True
        except:
            print("Not authenticated, starting authentication flow...")
        
        # Start authentication flow
        print("Opening browser for authentication...")
        print("Please authorize Earth Engine access in your browser")
        print("After authorization, return here and press Enter")
        
        # This will open browser for authentication
        ee.Authenticate()
        
        print("Authentication completed successfully!")
        print("You can now use Earth Engine API from Node.js!")
        
        return True
        
    except Exception as e:
        print(f"Authentication failed: {e}")
        return False

if __name__ == "__main__":
    setup_authentication()
