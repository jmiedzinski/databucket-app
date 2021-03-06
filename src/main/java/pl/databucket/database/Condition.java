package pl.databucket.database;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Condition {
	
	private SourceType leftSource;
	private Object leftValue;
	private Operator operator;
	private SourceType rightSource;
	private Object rightValue;
	
	public Condition(SourceType leftSource, Object leftValue, Operator operator, SourceType rightSource, Object rightValue) {
		this.leftSource = leftSource;
		this.leftValue = leftValue;
		this.operator = operator;
		this.rightSource = rightSource;
		this.rightValue = rightValue;
	}
	
	public Condition(String field, Operator operator, Object value) {
		this.leftSource = field.startsWith("$") ? SourceType.s_property : SourceType.s_field;
		this.leftValue = field;
		this.operator = operator;
		this.rightSource = SourceType.s_const;
		this.rightValue = value;
	}
	
	public Condition(Map<String, Object> conditionMap) {
		this.leftSource = SourceType.fromString((String) conditionMap.get(C.LEFT_SOURCE));
		this.operator = Operator.fromString((String) conditionMap.get(C.OPRERATOR));
		this.rightSource = SourceType.fromString((String) conditionMap.get(C.RIGHT_SOURCE));
		
		this.leftValue = conditionMap.get(C.LEFT_VALUE);
		this.rightValue = conditionMap.get(C.RIGHT_VALUE);
				
		if ((operator.equals(Operator.in) || operator.equals(Operator.notin)) && rightSource.equals(SourceType.s_const) && !(rightValue instanceof List)) {
			String rValue = (String) rightValue;
			if (rValue.contains(",")) {
				
				// cut [] brackets
				if (rValue.startsWith("["))
					rValue = rValue.substring(1);
				
				if (rValue.endsWith("]"))
					rValue = rValue.substring(0, rValue.length() -1 );
				
				String[] valuesStr = (rValue).split(",");
				
				// clean spaces and quotation marks
				for (int i = 0; i < valuesStr.length; i++) {
//				for (String vStr : valuesStr) {
					valuesStr[i] = valuesStr[i].trim();
					if (valuesStr[i].startsWith("\""))
						valuesStr[i] = valuesStr[i].substring(1);
					if (valuesStr[i].endsWith("\""))
						valuesStr[i] = valuesStr[i].substring(0, valuesStr[i].length() - 1);
				}
				
				// check if values are numbers
				boolean intValues = false;
				boolean floatValues = false;
				
				try {
					intValues = true;
					for (String vStr : valuesStr)
						Integer.parseInt(vStr);
				} catch (NumberFormatException e) {
					intValues = false;
				}
				
				if (!intValues) {
					floatValues = true;
					try {
						for (String vStr : valuesStr)
							Float.parseFloat(vStr);
					} catch (NumberFormatException e) {
						floatValues = false;
					}
				}
				
				if (intValues) {
					List<Integer> listOfValues = new ArrayList<Integer>();
					for (String vStr : valuesStr)
						listOfValues.add(Integer.parseInt(vStr));
					this.rightValue = listOfValues;
//					System.out.println("intValues: " + listOfValues);
				} else if (floatValues) {
					List<Float> listOfValues = new ArrayList<Float>();
					for (String vStr : valuesStr)
						listOfValues.add(Float.parseFloat(vStr));
					this.rightValue = listOfValues;
//					System.out.println("floatValues: " + listOfValues);
				} else {
					List<String> listOfValues = new ArrayList<String>();
					for (String vStr : valuesStr)
						listOfValues.add(vStr);
					this.rightValue = listOfValues;
//					System.out.println("stringValues: " + listOfValues);
				}				
			}
		}
	}

	public SourceType getLeftSource() {
		return leftSource;
	}
	
	public void setLeftValue(Object value) {
		leftValue = value;
	}

	public Object getLeftValue() {
		return leftValue;
	}

	public Operator getOperator() {
		return operator;
	}

	public SourceType getRightSource() {
		return rightSource;
	}
	
	public void setRightValue(Object value) {
		rightValue = value;
	}

	public Object getRightValue() {
		return rightValue;
	}		
}
