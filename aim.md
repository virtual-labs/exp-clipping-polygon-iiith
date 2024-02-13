In computer graphics, the process of rendering a 2D image onto a display screen often involves displaying a portion of the overall image within a designated area known as the display or clipped window. To enhance efficiency and reduce computational overhead, it is essential to eliminate unnecessary elements lying outside this display area. This selective removal of portions outside the clipped window is referred to as **clipping**.

The specific focus of this experiment is on **polygon clipping**, a technique used to remove segments of a polygon that extend beyond the boundaries of the clipped window. Two commonly employed algorithms for polygon clipping are the Sutherland-Hodgeman algorithm and the Wiler-Atherton algorithm. However, this experiment delves into the details of the Sutherland-Hodgeman Polygon Clipping algorithm, providing a comprehensive understanding of its implementation and significance in the context of computer graphics.