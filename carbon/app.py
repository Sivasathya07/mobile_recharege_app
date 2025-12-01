<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoTrack - Carbon Footprint Tracker</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --primary: #2e7d32;
            --primary-light: #60ad5e;
            --primary-dark: #005005;
            --secondary: #ff9800;
            --text: #333333;
            --text-light: #666666;
            --background: #f5f5f5;
            --card: #ffffff;
            --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: var(--background);
            color: var(--text);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background-color: var(--primary);
            color: white;
            padding: 1rem 0;
            box-shadow: var(--shadow);
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.5rem;
            font-weight: 700;
        }
        
        .logo i {
            font-size: 1.8rem;
        }
        
        nav ul {
            display: flex;
            list-style: none;
            gap: 20px;
        }
        
        nav a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.3s;
        }
        
        nav a:hover {
            opacity: 0.8;
        }
        
        .hero {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
            color: white;
            padding: 3rem 0;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.2rem;
            max-width: 700px;
            margin: 0 auto 2rem;
        }
        
        .btn {
            display: inline-block;
            background-color: var(--secondary);
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
            border: none;
            cursor: pointer;
        }
        
        .btn:hover {
            background-color: #e68900;
            transform: translateY(-2px);
        }
        
        .dashboard {
            padding: 3rem 0;
        }
        
        .section-title {
            text-align: center;
            margin-bottom: 2rem;
            color: var(--primary-dark);
        }
        
        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 2rem;
        }
        
        .card {
            background-color: var(--card);
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: var(--shadow);
            transition: transform 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card-title {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 1rem;
            color: var(--primary);
        }
        
        .card-title i {
            font-size: 1.5rem;
        }
        
        .carbon-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary);
            margin: 1rem 0;
        }
        
        .progress-bar {
            height: 10px;
            background-color: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
            margin: 1rem 0;
        }
        
        .progress {
            height: 100%;
            background-color: var(--primary);
        }
        
        .activity-form {
            background-color: var(--card);
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: var(--shadow);
            margin-bottom: 2rem;
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        select, input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .charts {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 20px;
            margin-bottom: 2rem;
        }
        
        .chart-container {
            background-color: var(--card);
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: var(--shadow);
        }
        
        .ai-insights {
            background-color: var(--card);
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: var(--shadow);
            margin-bottom: 2rem;
        }
        
        .insight-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #eee;
        }
        
        .insight-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .insight-icon {
            background-color: var(--primary-light);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .insight-content h3 {
            margin-bottom: 0.5rem;
            color: var(--primary-dark);
        }
        
        .comparison {
            background-color: var(--card);
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: var(--shadow);
            margin-bottom: 2rem;
        }
        
        .comparison-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        }
        
        footer {
            background-color: var(--primary-dark);
            color: white;
            padding: 2rem 0;
            text-align: center;
        }
        
        .footer-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        
        .social-links {
            display: flex;
            gap: 15px;
        }
        
        .social-links a {
            color: white;
            font-size: 1.5rem;
        }
        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .charts {
                grid-template-columns: 1fr;
            }
            
            nav ul {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container header-content">
            <div class="logo">
                <i class="fas fa-leaf"></i>
                <span>EcoTrack</span>
            </div>
            <nav>
                <ul>
                    <li><a href="#dashboard">Dashboard</a></li>
                    <li><a href="#track">Track Activity</a></li>
                    <li><a href="#insights">AI Insights</a></li>
                    <li><a href="#comparison">Comparison</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <section class="hero">
        <div class="container">
            <h1>Track Your Carbon Footprint</h1>
            <p>Monitor your environmental impact from travel, eating, cooking, and daily routines. Get personalized insights to reduce your carbon footprint.</p>
            <a href="#track" class="btn">Start Tracking Now</a>
        </div>
    </section>
    
    <section id="dashboard" class="dashboard container">
        <h2 class="section-title">Your Carbon Dashboard</h2>
        
        <div class="cards">
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-car"></i>
                    <h3>Travel Emissions</h3>
                </div>
                <p>Your carbon footprint from transportation</p>
                <div class="carbon-value">124 kg CO₂</div>
                <div class="progress-bar">
                    <div class="progress" style="width: 62%"></div>
                </div>
                <p>62% of your total footprint</p>
            </div>
            
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-utensils"></i>
                    <h3>Food Emissions</h3>
                </div>
                <p>Your carbon footprint from eating</p>
                <div class="carbon-value">58 kg CO₂</div>
                <div class="progress-bar">
                    <div class="progress" style="width: 29%"></div>
                </div>
                <p>29% of your total footprint</p>
            </div>
            
            <div class="card">
                <div class="card-title">
                    <i class="fas fa-home"></i>
                    <h3>Home Emissions</h3>
                </div>
                <p>Your carbon footprint from household activities</p>
                <div class="carbon-value">18 kg CO₂</div>
                <div class="progress-bar">
                    <div class="progress" style="width: 9%"></div>
                </div>
                <p>9% of your total footprint</p>
            </div>
        </div>
        
        <div id="track" class="activity-form">
            <h2 class="section-title">Track New Activity</h2>
            <form id="carbon-form">
                <div class="form-group">
                    <label for="activity-type">Activity Type</label>
                    <select id="activity-type" required>
                        <option value="">Select Activity Type</option>
                        <option value="travel">Travel</option>
                        <option value="food">Food</option>
                        <option value="cooking">Cooking</option>
                        <option value="household">Household</option>
                    </select>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="activity-subtype">Activity Subtype</label>
                        <select id="activity-subtype" required>
                            <option value="">Select Subtype</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="activity-value">Value</label>
                        <input type="number" id="activity-value" placeholder="Enter value" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="activity-unit">Unit</label>
                    <select id="activity-unit" required>
                        <option value="">Select Unit</option>
                    </select>
                </div>
                
                <button type="submit" class="btn">Calculate Carbon Footprint</button>
            </form>
        </div>
        
        <div class="charts">
            <div class="chart-container">
                <h3>Weekly Carbon Footprint</h3>
                <canvas id="weeklyChart"></canvas>
            </div>
            
            <div class="chart-container">
                <h3>Emission by Category</h3>
                <canvas id="categoryChart"></canvas>
            </div>
        </div>
        
        <div id="insights" class="ai-insights">
            <h2 class="section-title">AI-Powered Insights</h2>
            
            <div class="insight-item">
                <div class="insight-icon">
                    <i class="fas fa-car"></i>
                </div>
                <div class="insight-content">
                    <h3>Reduce Car Travel</h3>
                    <p>Your car travel accounts for 45% of your carbon footprint. Consider carpooling or using public transportation 2 days a week to reduce emissions by 18%.</p>
                </div>
            </div>
            
            <div class="insight-item">
                <div class="insight-icon">
                    <i class="fas fa-utensils"></i>
                </div>
                <div class="insight-content">
                    <h3>Plant-Based Alternatives</h3>
                    <p>Switching just two meat-based meals per week to plant-based alternatives could reduce your food carbon footprint by 25%.</p>
                </div>
            </div>
            
            <div class="insight-item">
                <div class="insight-icon">
                    <i class="fas fa-bolt"></i>
                </div>
                <div class="insight-content">
                    <h3>Energy Efficiency</h3>
                    <p>Your energy usage is 15% higher than similar households. Consider upgrading to LED bulbs and using smart power strips to save energy.</p>
                </div>
            </div>
        </div>
        
        <div id="comparison" class="comparison">
            <h2 class="section-title">Community Comparison</h2>
            
            <div class="comparison-item">
                <div>Your Carbon Footprint</div>
                <div>200 kg CO₂</div>
            </div>
            
            <div class="comparison-item">
                <div>Average in Your City</div>
                <div>240 kg CO₂</div>
            </div>
            
            <div class="comparison-item">
                <div>Sustainable Goal</div>
                <div>150 kg CO₂</div>
            </div>
            
            <div class="progress-bar" style="margin-top: 1.5rem;">
                <div class="progress" style="width: 75%; background-color: var(--secondary);"></div>
            </div>
            <p style="text-align: center; margin-top: 0.5rem;">You're doing better than 75% of people in your area</p>
        </div>
    </section>
    
    <footer>
        <div class="container footer-content">
            <div class="logo">
                <i class="fas fa-leaf"></i>
                <span>EcoTrack</span>
            </div>
            <p>Track your carbon footprint and make a difference for our planet</p>
            <div class="social-links">
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-facebook"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-linkedin"></i></a>
            </div>
            <p>&copy; 2023 EcoTrack. All rights reserved.</p>
        </div>
    </footer>
    
    <script>
        // Activity type options
        const activityOptions = {
            travel: [
                { value: 'car', text: 'Car (Gasoline)', unit: 'km', factor: 0.21 },
                { value: 'car-electric', text: 'Car (Electric)', unit: 'km', factor: 0.05 },
                { value: 'bus', text: 'Bus', unit: 'km', factor: 0.08 },
                { value: 'train', text: 'Train', unit: 'km', factor: 0.04 },
                { value: 'plane', text: 'Plane', unit: 'km', factor: 0.25 },
                { value: 'bicycle', text: 'Bicycle', unit: 'km', factor: 0 },
                { value: 'walking', text: 'Walking', unit: 'km', factor: 0 }
            ],
            food: [
                { value: 'beef', text: 'Beef', unit: 'kg', factor: 27 },
                { value: 'chicken', text: 'Chicken', unit: 'kg', factor: 6.9 },
                { value: 'pork', text: 'Pork', unit: 'kg', factor: 12.1 },
                { value: 'fish', text: 'Fish', unit: 'kg', factor: 5 },
                { value: 'vegetables', text: 'Vegetables', unit: 'kg', factor: 2 },
                { value: 'fruits', text: 'Fruits', unit: 'kg', factor: 1.5 },
                { value: 'grains', text: 'Grains', unit: 'kg', factor: 1.4 },
                { value: 'dairy', text: 'Dairy', unit: 'kg', factor: 3.2 }
            ],
            cooking: [
                { value: 'gas-stove', text: 'Gas Stove', unit: 'hour', factor: 0.5 },
                { value: 'electric-stove', text: 'Electric Stove', unit: 'hour', factor: 0.3 },
                { value: 'oven', text: 'Oven', unit: 'hour', factor: 1.2 },
                { value: 'microwave', text: 'Microwave', unit: 'hour', factor: 0.1 }
            ],
            household: [
                { value: 'electricity', text: 'Electricity', unit: 'kWh', factor: 0.5 },
                { value: 'heating', text: 'Heating (Natural Gas)', unit: 'kWh', factor: 0.2 },
                { value: 'water', text: 'Water Usage', unit: 'm³', factor: 0.4 },
                { value: 'waste', text: 'Waste', unit: 'kg', factor: 1.5 }
            ]
        };
        
        // Populate activity subtype and unit based on selected activity type
        document.getElementById('activity-type').addEventListener('change', function() {
            const type = this.value;
            const subtypeSelect = document.getElementById('activity-subtype');
            const unitSelect = document.getElementById('activity-unit');
            
            // Clear previous options
            subtypeSelect.innerHTML = '<option value="">Select Subtype</option>';
            unitSelect.innerHTML = '<option value="">Select Unit</option>';
            
            if (type && activityOptions[type]) {
                // Populate subtype options
                activityOptions[type].forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    optionElement.dataset.unit = option.unit;
                    optionElement.dataset.factor = option.factor;
                    subtypeSelect.appendChild(optionElement);
                });
                
                // Populate unit options based on first subtype
                if (activityOptions[type].length > 0) {
                    const unitOption = document.createElement('option');
                    unitOption.value = activityOptions[type][0].unit;
                    unitOption.textContent = activityOptions[type][0].unit;
                    unitSelect.appendChild(unitOption);
                }
            }
        });
        
        // Update unit when subtype changes
        document.getElementById('activity-subtype').addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const unit = selectedOption.dataset.unit;
            const unitSelect = document.getElementById('activity-unit');
            
            // Clear and set unit
            unitSelect.innerHTML = '';
            const unitOption = document.createElement('option');
            unitOption.value = unit;
            unitOption.textContent = unit;
            unitSelect.appendChild(unitOption);
        });
        
        // Handle form submission
        document.getElementById('carbon-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = document.getElementById('activity-type').value;
            const subtype = document.getElementById('activity-subtype').value;
            const value = parseFloat(document.getElementById('activity-value').value);
            const unit = document.getElementById('activity-unit').value;
            
            if (!type || !subtype || isNaN(value) || !unit) {
                alert('Please fill all fields correctly');
                return;
            }
            
            // Find the emission factor
            const selectedSubtype = document.getElementById('activity-subtype').options[document.getElementById('activity-subtype').selectedIndex];
            const factor = parseFloat(selectedSubtype.dataset.factor);
            
            // Calculate carbon footprint
            const carbon = value * factor;
            
            // In a real application, you would save this data and update the dashboard
            alert(`Carbon footprint: ${carbon.toFixed(2)} kg CO₂`);
            
            // Reset form
            this.reset();
            document.getElementById('activity-subtype').innerHTML = '<option value="">Select Subtype</option>';
            document.getElementById('activity-unit').innerHTML = '<option value="">Select Unit</option>';
        });
        
        // Initialize charts
        document.addEventListener('DOMContentLoaded', function() {
            // Weekly Carbon Footprint Chart
            const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
            const weeklyChart = new Chart(weeklyCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Carbon Footprint (kg CO₂)',
                        data: [32, 28, 35, 40, 38, 45, 30],
                        borderColor: '#2e7d32',
                        backgroundColor: 'rgba(46, 125, 50, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Weekly Carbon Footprint Trend'
                        }
                    }
                }
            });
            
            // Category Chart
            const categoryCtx = document.getElementById('categoryChart').getContext('2d');
            const categoryChart = new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Travel', 'Food', 'Home', 'Other'],
                    datasets: [{
                        data: [62, 29, 9, 0],
                        backgroundColor: [
                            '#2e7d32',
                            '#ff9800',
                            '#2196f3',
                            '#9e9e9e'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Emission by Category (%)'
                        }
                    }
                }
            });
        });
    </script>
</body>
</html>