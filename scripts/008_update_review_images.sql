-- Update existing reviews with placeholder images
UPDATE reviews
SET images = ARRAY[
  'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
  'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800'
]
WHERE user_name = '최서연';

UPDATE reviews
SET images = ARRAY[
  'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800',
  'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800'
]
WHERE user_name = '김민지';

UPDATE reviews
SET images = ARRAY[
  'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800',
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800',
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
]
WHERE user_name = '박준호';

UPDATE reviews
SET images = ARRAY[
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=800',
  'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'
]
WHERE user_name = '이수진';

UPDATE reviews
SET images = ARRAY[
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
  'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800',
  'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800'
]
WHERE user_name = '정현우';

UPDATE reviews
SET images = ARRAY[
  'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
  'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800'
]
WHERE user_name = '강지은';

UPDATE reviews
SET images = ARRAY[
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800',
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
]
WHERE user_name = '윤서아';
