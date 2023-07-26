def fill_gaps(issues):
    last = issues[-1] if isinstance(issues[-1], int) else issues[-1][-1]

    i = 1
    curr = 0
    while i <= last:
        issue = issues[curr]
        print(i)
        # print('iss', issues, curr)
        if i < issue[0]:
            if i + 1 == issue[0]:
                yield (i,)
            else:
                yield (i, issue[0]-1)
            i = issue[0]
        elif i == issue[0]:
            yield issue
            i = issue[-1] + 1
            curr += 1
        else:
            i = issues[curr][0]


# issues = [
#     (2,3), (5,6), (8,10), (11,), (14,)
# ]

issues = [(1, 2, 3), (4, 5), (6, 7), (8, 9), (10, 11, 12), (12, 13), (14, 15, 16), (17, 18), (21, 22), (23, 24),
          (25, 26), (27, 28), (29, 30, 31), (32, 33, 34), (35, 36), (37, 38), (39, 40),
          (40, 41), (43, 44), (45, 46), (47, 48), (49, 50, 51)]


f = fill_gaps(issues)
print(list(f))
