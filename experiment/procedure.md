## Procedure: Sutherland-Hodgman Polygon Clipping Experiment

### Step 1: Initial Setup
1. Open the simulation page
2. You will see:
   - A canvas area on the left
   - Input controls on the right
   - Navigation buttons at the bottom

### Step 2: Configure Clipping Window
1. Locate the "Clipping Window" section
2. Enter coordinates for:
   - Top Left Corner $(x_1, y_1)$
   - Bottom Right Corner $(x_2, y_2)$
3. Default values are provided for quick start

### Step 3: Define Polygon
1. Find the "Polygon Points" section
2. Enter coordinates for 5 points:
   - Point 1 $(x_1, y_1)$
   - Point 2 $(x_2, y_2)$
   - Point 3 $(x_3, y_3)$
   - Point 4 $(x_4, y_4)$
   - Point 5 $(x_5, y_5)$
3. Default values are available

### Step 4: Start Simulation
1. Click the "Submit" button
2. Observe:
   - Pink rectangle showing clipping window
   - Yellow dots and lines showing initial polygon
   - Coordinate labels for each vertex

### Step 5: Run the Experiment
1. Click "Next" to progress through steps:
   - Initial polygon state
   - After left edge clipping $(x = x_{min})$
   - After top edge clipping $(y = y_{max})$
   - After right edge clipping $(x = x_{max})$
   - After bottom edge clipping $(y = y_{min})$
   - Final clipped polygon

2. At each step, observe:
   - Yellow dots: Current vertices
   - Yellow lines: Current edges
   - White lines: Final clipped polygon
   - Intermediate Vertices panel: Current vertex coordinates

### Step 6: Navigation
1. Use "Next" to move forward
2. Use "Prev" to review previous steps
3. Use "Reset" to start over
4. Use "Submit" to try new coordinates

### Step 7: Experiment with Different Cases
1. Try different polygon shapes:
   - Completely inside window $(x_{min} \leq x \leq x_{max}, y_{min} \leq y \leq y_{max})$
   - Partially intersecting window
   - Completely outside window
2. Modify clipping window size
3. Observe how different configurations affect the result

### Step 8: Understanding the Output
1. Watch the "Intermediate Vertices" panel:
   - Shows current vertex coordinates $(x_i, y_i)$
   - Updates with each step
   - Helps track vertex changes

2. Observe the canvas:
   - Yellow elements show current state
   - White elements show final result
   - Coordinate labels help track positions

## Tips for Best Results
1. Start with default values to understand the process
2. Use "Prev" to review any step in detail
3. Pay attention to vertex coordinate changes
4. Try different polygon configurations
5. Observe how intersection points are created
