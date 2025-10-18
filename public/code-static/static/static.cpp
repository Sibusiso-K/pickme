// static.cpp
// Demonstrating the use of static data members and member functions
#include <iostream>
using namespace std;

class Account {
public:
	Account(const string& owner, double amount):_owner(owner),_amount(amount) {}
	double dailyReturn()
	{
 		return (_interestRate/365*_amount);
	}

	// static functions cannot refer to non-static data members (eg. _owner, _amount)
	static void raiseInterest(double incr)
	{
		_interestRate += incr;
	}
	static double interest() { return _interestRate; }

private:
	static double _interestRate;
	string _owner;
	double _amount;
};

// initialise _interestRate (statics should be initialised in a cpp file)
double Account::_interestRate = 0.08;

int main()
{
	Account Gates{"Bill Gates",100000000};
	Account Page{"Larry Page",10000000};

	cout << "Gates's daily return: " << Gates.dailyReturn() << endl;
	cout << "Page's daily return: " << Page.dailyReturn() << endl << endl;

	cout << "Current interest rate: " << Account::interest() << endl;
	Account::raiseInterest(0.02);
	cout << "New interest rate: " << Account::interest() << endl << endl;

	cout << "Gates's new daily return: " << Gates.dailyReturn() << endl;
	cout << "Page's new daily return: " << Page.dailyReturn() << endl << endl;
}
