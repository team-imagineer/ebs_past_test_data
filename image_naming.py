import os

DATA_PATH = './dataset'
IMAGE_PATH = './image'

files = [fname for fname in os.listdir(IMAGE_PATH)
         if os.path.isfile(os.path.join(IMAGE_PATH, fname))]

for file in files:
    chunks = file.split('_')

    if len(chunks) == 3:
        # 개정 전 국어
        yyyy, m, fname = chunks
        category = '개정전국어'
    elif len(chunks) == 4:
        yyyy, m, category, fname = chunks

        if category == 'writing':
            category = '화법과작문'
        elif category == 'media':
            category = '언어와매체'

    if len(m) == 1:
        # 9 => 09
        m = '0' + m

    if not fname.startswith('p'):
        fname = 'q' + fname

    dirpath = os.path.join(DATA_PATH, '/'.join([yyyy + '년', m + '월', '3학년',category]))
    if not os.path.exists(dirpath):
        os.makedirs(dirpath)

    os.rename(os.path.join(IMAGE_PATH, file), os.path.join(dirpath, fname))


