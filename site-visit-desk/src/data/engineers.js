// Each engineer is certified for one or more categories and belongs to a city.
// Used to build the dependent "Assigned engineer" <optgroup> select in RequestForm.
export const engineers = [
  { id: 'ENG-01', name: 'Arjun Mehta', city: 'Mumbai', categories: ['Networking', 'SCADA'] },
  { id: 'ENG-02', name: 'Priya Nair', city: 'Mumbai', categories: ['CCTV', 'Fire & Safety'] },
  { id: 'ENG-03', name: 'Rohan Fernandes', city: 'Mumbai', categories: ['PA System', 'Networking'] },
  { id: 'ENG-04', name: 'Sana Sheikh', city: 'Pune', categories: ['SCADA', 'Fire & Safety'] },
  { id: 'ENG-05', name: 'Devendra Kulkarni', city: 'Pune', categories: ['Networking', 'CCTV'] },
  { id: 'ENG-06', name: 'Meera Iyer', city: 'Pune', categories: ['PA System'] },
  { id: 'ENG-07', name: 'Karan Bhatt', city: 'Delhi', categories: ['CCTV', 'SCADA'] },
  { id: 'ENG-08', name: 'Ishaan Chawla', city: 'Delhi', categories: ['Networking', 'Fire & Safety'] },
  { id: 'ENG-09', name: 'Ritika Sen', city: 'Bengaluru', categories: ['SCADA', 'PA System'] },
  { id: 'ENG-10', name: 'Ovais Ansari', city: 'Bengaluru', categories: ['CCTV', 'Networking'] },
  { id: 'ENG-11', name: 'Lavanya Reddy', city: 'Bengaluru', categories: ['Fire & Safety'] },
  { id: 'ENG-12', name: 'Tarun Vora', city: 'Chennai', categories: ['SCADA', 'Networking', 'CCTV'] },
];

export const engineersByCategory = (category) =>
  engineers.filter((eng) => eng.categories.includes(category));

export const citiesInOrder = [...new Set(engineers.map((e) => e.city))];
