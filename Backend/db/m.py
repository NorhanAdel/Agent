try:
    filename=input("Enter a file name:")
    file=open(filename,"w")
    N=int (input("Enter the number:"))
    M=int (input("Enter the number:"))
    file.close()
    file=open("output".txt,"w")
    file.write(N(-1) +M(-1))
    file.close()
except : 
    print("Error")
